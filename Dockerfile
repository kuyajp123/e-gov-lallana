# ========================================================
# Production Dockerfile for Laravel + React/Inertia on Render
# ========================================================
FROM php:8.4-fpm-bookworm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies, Nginx, Node.js (v22), and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    curl \
    git \
    zip \
    unzip \
    libpq-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    ca-certificates \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y --no-install-recommends nodejs \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        gd \
        zip \
        intl \
        bcmath \
        opcache \
        exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application source code
COPY . .

# 1. Install PHP dependencies first (generates vendor/autoload.php needed by Wayfinder)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# 2. Install Node dependencies and build frontend assets
RUN npm ci && npm run build && rm -rf node_modules

# 3. Configure Nginx
COPY docker/nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# 4. Set directory permissions for Laravel storage and cache
RUN chmod +x docker/start.sh \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose web ports
EXPOSE 80 10000

# Start services via entrypoint
CMD ["/var/www/html/docker/start.sh"]
