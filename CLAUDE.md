# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a 42 School "Inception" project: a small Docker-based infrastructure stack built entirely from custom Dockerfiles (no pre-built images from Docker Hub, e.g. no `nginx:latest` or `wordpress:latest`). It provisions a WordPress site behind NGINX with a MariaDB backend, wired together with Docker Compose.

Three services, one per container, each built from Debian `bookworm`:

```
Browser --HTTPS:443--> NGINX --FastCGI:9000--> WordPress (PHP-FPM) --:3306--> MariaDB
```

- **nginx** — reverse proxy and the only container that exposes a port to the host (`443:443`). Terminates TLS (self-signed cert generated at build time) and proxies `.php` requests to `wordpress:9000` over FastCGI. Serves static files directly from the shared `wordpress_data` volume.
- **wordpress** — PHP-FPM 8.2 running WordPress core, no web server of its own (nginx is the front door). Provisioned via `wp-cli`.
- **mariadb** — database server, not exposed to the host, only reachable from other containers on the `inception` bridge network.

## Repository layout

- `Makefile` — thin wrapper around `docker compose`.
- `srcs/docker-compose.yml` — defines the three services, the `inception` bridge network, and two bind-mounted named volumes.
- `srcs/.env` — all configuration (domain, DB credentials, WP admin/user credentials) as plaintext env vars consumed via `env_file` in every service. **This file is committed to git** (there is no `.gitignore`) — treat any credentials in it as already-exposed 42-project defaults, not real secrets.
- `srcs/requirements/<service>/` — one directory per container, each with a `Dockerfile`, a `tools/setup.sh` entrypoint script, and a `conf/` directory with service config copied in at build time.
- `secrets/` — currently unused placeholder files (`credentials.txt`, `db_password.txt`, `db_root_password.txt`); nothing in `docker-compose.yml` references Docker secrets or these files. Don't assume they're wired up.
- `README.md`, `USER_DOC.md`, `DEV_DOC.md` — user/dev-facing docs (build & access instructions, debugging commands). Consult these for anything not covered here; keep them in sync if you change `Makefile` targets or the compose topology.

## Commands

Build and start everything (foreground, rebuilds images):
```bash
make            # docker compose -f srcs/docker-compose.yml up --build
```

Stop containers (keeps volumes/images):
```bash
make down       # docker compose -f srcs/docker-compose.yml down
```

Remove dangling images/build cache (does not touch this project's volumes):
```bash
make clean      # docker system prune -af
```

Full teardown — stops containers, removes the compose volumes, and prunes all images/volumes system-wide:
```bash
make fclean     # docker compose down -v && docker system prune -af --volumes
```

Rebuild from scratch:
```bash
make re         # fclean then all
```

There is no test suite, linter, or CI in this repo — validation is manual (see Debugging below).

### Prerequisites for `make` to work

- Docker, Docker Compose, GNU Make.
- Host directories for the bind-mounted volumes must exist: `/home/aisaev/data/mariadb` and `/home/aisaev/data/wordpress` (hardcoded in `docker-compose.yml` under `volumes.*.driver_opts.device`). If working on a different host/user, these paths need updating in `docker-compose.yml` to match.
- `/etc/hosts` should map the domain to localhost, e.g. `127.0.0.1 aisaev.42.fr` (domain comes from `DOMAIN_NAME` in `srcs/.env`).

## Debugging

```bash
docker exec -it nginx nginx -t     # validate nginx config
docker exec -it mariadb mysql      # open a MariaDB shell
docker logs <nginx|wordpress|mariadb>
docker ps
```

## Key conventions when modifying this stack

- **No official images.** Every Dockerfile starts `FROM debian:bookworm` and installs packages via `apt`; don't switch to `FROM nginx`, `FROM wordpress`, `FROM mariadb`, etc. — this violates the project's core constraint.
- **CMD is a setup script, not the daemon directly.** Each `Dockerfile` ends with `CMD ["/setup.sh"]`, and `tools/setup.sh` does first-boot provisioning (create DB/user, install WordPress via `wp-cli`, generate config) before `exec`-ing the actual foreground process (`mysqld_safe`, `php-fpm8.2 -F`, `nginx -g "daemon off;"`). The `exec` matters — it keeps that process as PID 1 so the container stops cleanly and Compose can supervise it. Follow this pattern for any new service.
- **Startup ordering uses polling, not `depends_on: condition: service_healthy`.** `wordpress/tools/setup.sh` polls `mysql -h mariadb ...` until MariaDB responds; `nginx/tools/setup.sh` polls `nc -z wordpress 9000` until PHP-FPM is listening. `depends_on` in the compose file only controls container *start* order, not readiness — if you add a new inter-service dependency, add a similar poll loop rather than relying on `depends_on` alone.
- **Idempotent provisioning.** WordPress setup checks `if [ ! -f wp-config.php ]` before installing, so re-running the container (e.g. after `make down && make`, without `-v`) doesn't reinstall over the persisted volume. Preserve this check if you edit the script.
- **Persistence via named volumes bound to fixed host paths**, not anonymous volumes: `mariadb_data` → `/var/lib/mysql`, `wordpress_data` → `/var/www/html` (also mounted read/write into `nginx` so it can serve static files directly). Data survives `make down`/`make`; only `make fclean`/`make re` wipes it (`docker compose down -v`).
- **Network isolation.** Only `nginx` publishes a host port (`443`); `wordpress` and `mariadb` are reachable only via the internal `inception` bridge network, by container/service name (e.g. `mariadb:3306`, `wordpress:9000`).
- **All configuration flows through `srcs/.env`** via `env_file:` in each service — don't hardcode credentials/domain in Dockerfiles or conf files; reference the existing env vars (`MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `DOMAIN_NAME`, `WP_*`) the way `setup.sh` scripts already do.
