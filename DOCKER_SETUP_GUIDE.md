# Docker Setup Guide for Aplikasi Bidan Pintar

This guide details how to set up and run the application using Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.
- Git (optional, for cloning).

## Directory Structure

Ensure your project structure looks like this:

```
AplikasiBidanFeBe/
├── TUBES PROTEIN BE/
│   └── aplikasi-bidan-pintar/  (Backend source)
│       └── Dockerfile
├── TUBES PROTEIN FE/           (Frontend source)
│   └── Dockerfile
├── .env.docker                 (Environment Config)
├── docker-compose.yml          (Orchestration)
├── nginx.conf                  (Web Server Config)
└── init-db.sh / database/      (DB Init Scripts)
```

## Setup Steps

### 1. Configuration

1.  **Environment Variables**:
    - A `.env.docker` file has been created.
    - Open it and **UPDATE** the `EMAIL_USER`, `EMAIL_PASS`, and `JWT_SECRET` with your real credentials.
    - You can leave DB credentials as is for local Docker development.

2.  **SSL Certificates** (Optional for Local, Required for Production):
    - The `nginx` service expects Let's Encrypt certificates at `/etc/letsencrypt`.
    - If running locally without SSL, you can ignore 443 errors or comment out the 443 block in `docker-compose.yml` and `nginx.conf`.
    - For production, ensure you have generated certificates for `bidanku.site`.

### 2. Building and Running

1.  Open a terminal in the root directory (`AplikasiBidanFeBe`).
2.  Run the following command to build images and start containers:

    ```bash
    docker-compose up -d --build
    ```

    - `-d`: Detached mode (runs in background).
    - `--build`: Rebuilds images if Dockerfiles have changed.

### 3. Verification

- **Frontend**: Open [http://localhost](http://localhost) (via Nginx) or [http://localhost:5173](http://localhost:5173) (Direct Vite).
- **Backend API**: Accessible at [http://localhost/api](http://localhost/api).
- **phpMyAdmin**: Open [http://localhost:8081](http://localhost:8081).
  - Server: `db`
  - Username: `habb`
  - Password: `bismillah`

## Common Commands

- **Stop containers**:
  ```bash
  docker-compose down
  ```

- **View Logs**:
  ```bash
  docker-compose logs -f
  ```
  (Ctrl+C to exit logs)

- **Restart specific service** (e.g., backend):
  ```bash
  docker-compose restart app
  ```

## Troubleshooting

- **Database Connection Error**: Wait a few seconds. The MySQL container takes a moment to initialize on the first run.
- **Port Conflicts**: Ensure ports 80, 443, 8081, 5173, and 5000 are not used by other applications on your host machine.
