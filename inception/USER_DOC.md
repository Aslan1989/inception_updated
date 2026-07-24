# USER_DOC.md

# User Documentation

## Overview

This infrastructure provides:

- HTTPS web server
- WordPress CMS
- MariaDB database
- persistent storage
- Docker container orchestration

---

# Starting the Project

```bash
make
```

---

# Stopping the Project

```bash
make down
```

---

# Rebuilding the Project

```bash
make re
```

---

# Accessing the Website

Open:

```text
https://aisaev.42.fr
```

A browser security warning may appear because the SSL certificate is self-signed.

Proceed anyway.

---

# Accessing WordPress Admin Panel

Open:

```text
https://aisaev.42.fr/wp-admin
```

Use administrator credentials from `.env`.

---

# Checking Container Status

```bash
docker ps
```

---

# Viewing Logs

## NGINX

```bash
docker logs nginx
```

## WordPress

```bash
docker logs wordpress
```

## MariaDB

```bash
docker logs mariadb
```
