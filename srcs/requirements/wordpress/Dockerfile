FROM debian:bookworm

RUN apt update && apt install -y \
php \
php-fpm \
php-mysql \
mariadb-client \
curl

RUN sed -i 's|listen = .*|listen = 9000|' \
/etc/php/8.2/fpm/pool.d/www.conf
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

RUN chmod +x wp-cli.phar

RUN mv wp-cli.phar /usr/local/bin/wp

RUN mkdir -p /run/php

COPY ./tools/setup.sh /setup.sh
RUN chmod +x /setup.sh
CMD ["/setup.sh"]