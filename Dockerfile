# ==========================================
# Stage 1: Build Frontend Assets (React/Vite)
# ==========================================
FROM node:22-bookworm-slim AS frontend-builder
WORKDIR /app

# Install PHP-CLI so Laravel Wayfinder plugin can scan route definitions during build
RUN apt-get update && apt-get install -y --no-install-recommends php-cli git && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# Stage 2: Production PHP + Nginx Environment
# ==========================================
FROM php:8.4-fpm-bookworm AS runner

# Install system dependencies & Nginx
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
        mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Composer binary from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application source code
COPY . .

# Copy built frontend assets from Stage 1
COPY --from=frontend-builder /app/public/build /var/www/html/public/build

# Install production PHP dependencies
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Configure startup script
RUN chmod +x docker/start.sh

# Set directory permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose web port
EXPOSE 80 10000

# Execute entrypoint script
CMD ["/var/www/html/docker/start.sh"]
