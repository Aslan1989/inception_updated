# DEV_DOC.md

# Developer Documentation

## Project Goal

The goal of this project is to create a secure Docker-based infrastructure using isolated containers and persistent storage.

---

# Prerequisites

Required software:

- Docker
- Docker Compose
- GNU Make
- Linux Virtual Machine

---

# Required Directories

Create persistence directories:

```bash
mkdir -p /home/aslan/data/mariadb
mkdir -p /home/aslan/data/wordpress
```

---

# Configure Domain

Edit:

```text
/etc/hosts
```

Add:

```text
127.0.0.1 aisaev.42.fr
```

---

# Build and Launch

```bash
make
```

Equivalent command:

```bash
docker compose -f srcs/docker-compose.yml up --build
```

---

# Useful Debugging Commands

## nginx Configuration Test

```bash
docker exec -it nginx nginx -t
```

## MariaDB Access

```bash
docker exec -it mariadb mysql -u root -p
```

Root now requires a password (set during container startup). Use the value of
`MYSQL_ROOT_PASSWORD` from `.env`.

## View Logs

```bash
docker logs nginx
```

---

# Infrastructure Flow

```text
Browser
   ↓
NGINX
   ↓
PHP-FPM
   ↓
WordPress
   ↓
MariaDB
```

---

# SSL/TLS

Self-signed SSL certificates are generated inside the nginx container using OpenSSL.

Protocols:

```text
TLSv1.2
TLSv1.3
```
