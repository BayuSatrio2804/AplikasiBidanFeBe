# DNS & VPS Setup Guide

This guide covers setting up your domain `bidanku.site` and configuring your VPS (`145.79.15.211`).

## Part 1: DNS Configuration (Domain)

You need to point your domain to your VPS IP address so that visitors can access your site.

1.  **Login** to your domain registrar (where you bought `bidanku.site`).
2.  Find the **DNS Management** or **DNS Records** section.
3.  **Add/Edit Records**:

| Type | Host / Name | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `145.79.15.211` | Automatic / 1 min |
| **A** | `www` | `145.79.15.211` | Automatic / 1 min |

> [!NOTE]
> It may take anywhere from a few minutes to 24 hours for these changes to propagate worldwide.

## Part 2: VPS Setup (Server)

### 1. Login to VPS
Use SSH to connect to your server. Open your terminal (PowerShell/CMD on Windows):

```bash
ssh root@145.79.15.211
# Enter your VPS password when prompted
```

### 2. Update System
Running a fresh update is always good practice.

```bash
apt update && apt upgrade -y
```

### 3. Install Docker & Docker Compose
Install the Docker engine.

```bash
# Install prerequisites
apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose (plugin)
apt install -y docker-compose-plugin
```

### 4. Deploy Application

You have two options to get your code onto the server: **Git** (Recommended) or **SCP** (File Copy).

#### Option A: Using Git (If your repo is on GitHub/GitLab)

```bash
# 1. Clone your repository
git clone https://github.com/your-username/AplikasiBidanFeBe.git bidanku

# 2. Enter directory
cd bidanku
```

#### Option B: Setup Manually (If no Git repo)

```bash
# 1. Create directory
mkdir -p ~/bidanku

# 2. On your LOCAL Machine (Windows), copy files to VPS
# Run this from your project folder in Windows PowerShell:
scp -r "TUBES PROTEIN BE" "TUBES PROTEIN FE" docker-compose.yml nginx.conf .env.docker root@145.79.15.211:~/bidanku/
```

### 5. Configure Environment

1.  **Enter the project directory on VPS**:
    ```bash
    cd ~/bidanku
    ```
2.  **Setup `.env`**:
    ```bash
    cp .env.docker .env
    nano .env
    ```
3.  **Edit**:
    - Update `JWT_SECRET`, `EMAIL_USER`, etc. with real values.
    - Save: `Ctrl+O`, `Enter`, `Ctrl+X`.

### 6. Run Application

```bash
docker compose up -d --build
```

### 7. Verification

- Visit `http://bidanku.site` in your browser.
- Visit `http://bidanku.site/api/health` to check the backend.

## Bonus: SSL with Certbot (HTTPS)
Since you own the domain, you can set up free secure HTTPS.

1.  **Modify `docker-compose.yml`** to use the `certbot/certbot` image (Optional advanced setup), OR
2.  **Simple Method**:
    - Install Certbot on Host: `apt install -y certbot python3-certbot-nginx`
    - *Note: This requires running Nginx on the host, referencing the docker containers via Proxy, effectively changing our setup. For simplicity, use the Docker setup provided and consider a separate Nginx Proxy Manager container for easy SSL if needed later.*

For now, verify the site works on **HTTP** first.
