# Server Deployment Guide

This guide covers how to deploy the PC Configurator CMS to a traditional Virtual Private Server (VPS) such as DigitalOcean, AWS EC2, or Linode using Nginx and PHP-FPM.

## Prerequisites
Your server should be provisioned with:
- Ubuntu 22.04 / 24.04 (or similar Linux distribution)
- Nginx
- PHP 8.2+ and required extensions (`php-mbstring`, `php-xml`, `php-bcmath`, `php-curl`, `php-mysql` / `php-pgsql`, `php-zip`)
- MySQL 8 or PostgreSQL 15+
- Composer
- Node.js & npm (v18+)

## 1. Deploy the Codebase
Log into your server via SSH and navigate to the web root directory (usually `/var/www`):

```bash
cd /var/www
git clone <your-repository-url> pc-configurator
cd pc-configurator
```

## 2. Set Directory Permissions
Ensure the web server (usually `www-data`) has the appropriate read/write permissions to the `storage` and `bootstrap/cache` directories.

```bash
sudo chown -R $USER:www-data storage
sudo chown -R $USER:www-data bootstrap/cache
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

## 3. Environment Configuration
Create the production environment file:
```bash
cp .env.example .env
```
Edit the `.env` file (`nano .env`) and set the following critical values:
```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

## 4. Install Dependencies
Install production dependencies without development packages:
```bash
composer install --optimize-autoloader --no-dev
```

## 5. Generate Key & Migrate
Generate the Laravel App Key and run migrations to build the tables:
```bash
php artisan key:generate
php artisan migrate --force
```

## 6. Build Frontend Assets
Compile the Tailwind CSS and Alpine.js assets for production:
```bash
npm install
npm run build
```

## 7. Optimize Laravel
Cache the framework settings to improve performance significantly:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 8. Nginx Configuration
Create an Nginx server block for the application:
```bash
sudo nano /etc/nginx/sites-available/pc-configurator
```

Use the following configuration template (adjust `server_name` and `root`):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    root /var/www/pc-configurator/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Adjust PHP version
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/pc-configurator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 9. Next Steps
- Use **Certbot (Let's Encrypt)** to provision an SSL certificate for `yourdomain.com`.
- Optional: Use a tool like **Laravel Forge** or **Ploi.io** to automate all the server provisioning and deployment steps above.
