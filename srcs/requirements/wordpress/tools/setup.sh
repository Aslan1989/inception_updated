#!/bin/bash

mkdir -p /var/www/html

cd /var/www/html

until mysql -h mariadb -u${MYSQL_USER} -p${MYSQL_PASSWORD} -e "SHOW DATABASES;" > /dev/null 2>&1;
do
    echo "Waiting for MariaDB..."
    sleep 5
done
echo "MariaDB is ready!"

if [ ! -f wp-config.php ]; then
    curl -O https://wordpress.org/latest.tar.gz
    tar -xzf latest.tar.gz
    cp -r wordpress/* .
    rm -rf wordpress latest.tar.gz

    wp config create \
        --allow-root \
        --dbname=${MYSQL_DATABASE} \
        --dbuser=${MYSQL_USER} \
        --dbpass=${MYSQL_PASSWORD} \
        --dbhost=mariadb:3306

    sleep 5

    wp core install \
        --allow-root \
        --url=${DOMAIN_NAME} \
        --title=${WP_TITLE} \
        --admin_user=${WP_ADMIN_USER} \
        --admin_password=${WP_ADMIN_PASSWORD} \
        --admin_email=${WP_ADMIN_EMAIL}

	# Install and activate Redis plugin
	wp plugin install redis-cache \
		--activate \
		--allow-root
	
	# Configure Redis settings in wp-config.php
	wp config set WP_REDIS_HOST redis \
		--type=constant \
		--allow-root

	# Enable Redis object caching
	wp redis enable --allow-root

    wp user create \
        --allow-root \
        ${WP_USER} ${WP_USER_EMAIL} \
        --user_pass=${WP_USER_PASSWORD}
fi

mkdir -p /run/php

chown -R www-data:www-data /var/www/html
exec /usr/sbin/php-fpm8.2 -F