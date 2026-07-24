#!/bin/bash

service mariadb start

sleep 5

mysql -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};"

mysql -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';"

mysql -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';"
# Reload MariaDB privilege tables
mysql -e "FLUSH PRIVILEGES;"

mysqladmin shutdown

exec mysqld_safe