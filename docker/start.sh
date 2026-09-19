#!/bin/sh
set -e

# Default to port 80 if PORT is not set
PORT="${PORT:-80}"
echo "Configuring Nginx to listen on 0.0.0.0:${PORT}..."
sed -i "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/sites-available/default
sed -i "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Forward Nginx logs to container stdout/stderr for Render live logging
ln -sf /dev/stdout /var/log/nginx/access.log 2>/dev/null || true
ln -sf /dev/stderr /var/log/nginx/error.log 2>/dev/null || true

# Tune PHP-FPM concurrency pool for Render Free Tier (512MB RAM)
echo "Configuring PHP-FPM concurrency and Unix domain socket..."
sed -i 's/pm.max_children = 5/pm.max_children = 8/g' /usr/local/etc/php-fpm.d/www.conf 2>/dev/null || true
sed -i 's/pm.start_servers = 2/pm.start_servers = 2/g' /usr/local/etc/php-fpm.d/www.conf 2>/dev/null || true
sed -i 's/pm.min_spare_servers = 1/pm.min_spare_servers = 1/g' /usr/local/etc/php-fpm.d/www.conf 2>/dev/null || true
sed -i 's/pm.max_spare_servers = 3/pm.max_spare_servers = 4/g' /usr/local/etc/php-fpm.d/www.conf 2>/dev/null || true
echo "pm.max_requests = 500" >> /usr/local/etc/php-fpm.d/www.conf 2>/dev/null || true

# Switch PHP-FPM from TCP 9000 to Unix domain socket
# This eliminates TCP port 9000 conflicts with Render port scanning and improves IPC throughput
cat << 'EOF' > /usr/local/etc/php-fpm.d/zz-docker.conf
[global]
daemonize = no

[www]
listen = /var/run/php-fpm.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660
EOF

sed -i 's|^listen = .*|listen = /var/run/php-fpm.sock|g' /usr/local/etc/php-fpm.d/www.conf 2>/dev/null || true
rm -f /var/run/php-fpm.sock

# Storage symlink
php artisan storage:link || true

# Cache Laravel configuration & routes for production performance
echo "Caching Laravel configuration..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Run database migrations if configured
if [ "${AUTO_MIGRATE:-true}" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || echo "Migration warning: check database connection."
fi

# Bootstrap super administrators once at boot
echo "Bootstrapping super administrators..."
php artisan app:bootstrap-admins || echo "Admin bootstrap warning: check configuration."

# Start Laravel queue worker in background for asynchronous tasks (emails, notifications)
if [ "${RUN_QUEUE_WORKER:-true}" = "true" ]; then
    echo "Starting background queue worker..."
    php artisan queue:work --sleep=3 --tries=3 --max-time=3600 &
fi

# Start PHP-FPM in daemon mode
echo "Starting PHP-FPM..."
php-fpm -D

# Wait briefly for PHP-FPM Unix socket to be ready before starting Nginx
for i in $(seq 1 10); do
    if [ -S /var/run/php-fpm.sock ]; then
        echo "PHP-FPM Unix socket is ready."
        break
    fi
    sleep 0.5
done

# Start Nginx in the foreground (keeps container running)
echo "Starting Nginx on port ${PORT}..."
exec nginx -g "daemon off;"
