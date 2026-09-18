#!/bin/sh
set -e

# Default to port 80 if PORT is not set
PORT="${PORT:-80}"
echo "Configuring Nginx to listen on port ${PORT}..."
sed -i "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/sites-available/default
sed -i "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/conf.d/default.conf 2>/dev/null || true

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

# Start Laravel queue worker in background for asynchronous tasks (emails, notifications)
if [ "${RUN_QUEUE_WORKER:-true}" = "true" ]; then
    echo "Starting background queue worker..."
    php artisan queue:work --sleep=3 --tries=3 --max-time=3600 &
fi

# Start PHP-FPM in daemon mode
echo "Starting PHP-FPM..."
php-fpm -D

# Start Nginx in the foreground (keeps container running)
echo "Starting Nginx on port ${PORT}..."
exec nginx -g "daemon off;"