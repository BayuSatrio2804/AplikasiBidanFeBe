# Docker Verification Checklist

Use this checklist to ensure your Docker environment is correctly set up and running.

## 1. Container Status
- [ ] Run `docker-compose ps`. All containers (`app`, `vite`, `nginx`, `db`, `phpmyadmin`) should be `Up`.

## 2. Web Access
- [ ] **Frontend**: Access `http://localhost`. Should load the React App.
- [ ] **Frontend (Direct)**: Access `http://localhost:5173`. Should load the React App (Dev mode).
- [ ] **Backend Health**: Access `http://localhost/api/health` (if endpoint exists) or `http://localhost:5000`. Should return a response.
- [ ] **phpMyAdmin**: Access `http://localhost:8081`. Login with `habb` / `bismillah`.

## 3. Database
- [ ] In phpMyAdmin, check if the database `bidanku` exists.
- [ ] Check if tables are created (from `database/` import).

## 4. Connectivity
- [ ] **Frontend -> Backend**: Try logging in or fetching data on the frontend. It should successfully communicate with the backend.
- [ ] **Backend -> DB**: The backend logs should show "Database connected" (view with `docker-compose logs app`).

## 5. SSL (If applicable)
- [ ] Access `https://bidanku.site` or `https://localhost` (accept warning if self-signed). Nginx should handle the connection.
