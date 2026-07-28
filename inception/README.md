*This project has been created as part of the 42 curriculum by aisaev.*

# Inception

## Description

Inception is a System Administration project from the 42 curriculum focused on Docker, containerization, networking, persistence, and service orchestration.

The goal of the project is to build a secure and isolated infrastructure composed of multiple services running inside dedicated Docker containers.

This project includes:

- NGINX with TLSv1.2/TLSv1.3
- WordPress with PHP-FPM
- MariaDB
- Docker volumes for persistence
- Docker bridge networking
- HTTPS-only access

The infrastructure is entirely built using custom Dockerfiles without pulling preconfigured images.

---

# Architecture

```text
Browser
   |
HTTPS :443
   |
NGINX
   |
PHP-FPM :9000
   |
WordPress
   |
MariaDB :3306
```

---

# Project Structure

```text
inception/
├── Makefile
├── secrets/
├── README.md
├── USER_DOC.md
├── DEV_DOC.md
└── srcs/
    ├── .env
    ├── docker-compose.yml
    └── requirements/
        ├── mariadb/
        ├── nginx/
        └── wordpress/
```

---

# Instructions

## Build and Start

```bash
make
```

## Stop Containers

```bash
make down
```

## Full Cleanup

```bash
make fclean
```

## Rebuild Everything

```bash
make re
```

---

# Access

## Website

```text
https://aisaev.42.fr
```

## WordPress Admin

```text
https://aisaev.42.fr/wp-admin
```

---

# Persistence

Persistent data is stored inside:

```text
/home/aslan/data/
```

---

# AI Usage

AI tools were used for:

- infrastructure debugging
- Docker concepts explanation
- nginx and SSL troubleshooting
- documentation drafting
- architecture understanding

All generated content was manually reviewed, tested, and understood before integration.
