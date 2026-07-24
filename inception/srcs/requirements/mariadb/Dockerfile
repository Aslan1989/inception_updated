# the base image
FROM debian:bookworm

RUN apt update && apt install -y mariadb-server

# Change MariaDB configuration:
# allow connections from other containers
# 0.0.0.0 means "listen on all network interfaces"
RUN sed -i 's/bind-address\s*=.*/bind-address = 0.0.0.0/' /etc/mysql/mariadb.conf.d/50-server.cnf

# Copy the setup script from local machine into the container
COPY ./tools/setup.sh /setup.sh

RUN chmod +x /setup.sh
# Document that the container uses port 3306 (MariaDB default port)
EXPOSE 3306
# Run the setup script when the container starts
CMD ["/setup.sh"]