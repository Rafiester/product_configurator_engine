# Server Deployment Guide (Next.js & PM2)

This guide covers how to deploy the Next.js PC Configurator dashboard to a traditional Virtual Private Server (VPS) such as DigitalOcean, AWS EC2, or Linode using Nginx and PM2.

## Prerequisites
Your server should be provisioned with:
- Ubuntu 22.04 / 24.04 (or similar Linux distribution)
- Nginx
- Node.js (v18.0 or higher) & npm
- Git
- PM2 (Process Manager 2) installed globally (`npm install -g pm2`)
- An active Supabase PostgreSQL database connection

---

## 1. Deploy the Codebase
Log into your server via SSH and navigate to the web root directory:
```bash
cd /var/www
git clone <your-repository-url> pc-configurator
cd pc-configurator
```

---

## 2. Environment Configuration
Create the production environment file:
```bash
cp .env.example .env
```
Edit the `.env` file (`nano .env`) and set your Supabase production URLs:
```ini
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10&connect_timeout=30"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

---

## 3. Install Dependencies & Build
Run the following commands to install packages, compile the Tailwind stylesheets, and generate the Prisma Client for production:
```bash
npm install
npx prisma generate
npm run build
```

---

## 4. Run Next.js with PM2
To keep the Next.js application running in the background and survive server reboots, run it via PM2:
```bash
pm2 start npm --name "pc-configurator" -- start
```
Configure PM2 to launch automatically on server restarts:
```bash
pm2 startup
pm2 save
```

---

## 5. Nginx Configuration
Create an Nginx configuration file to act as a reverse proxy, forwarding web traffic from port 80 to Next.js on port 3000.
```bash
sudo nano /etc/nginx/sites-available/pc-configurator
```

Insert the following server block (replace `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next/static {
        alias /var/www/pc-configurator/.next/static;
        expires 365d;
        access_log off;
    }
}
```

Enable the configuration and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/pc-configurator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. Security (SSL)
It is highly recommended to secure the site with HTTPS using Certbot (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```
Follow the prompts to enable redirecting all HTTP traffic to HTTPS automatically.
