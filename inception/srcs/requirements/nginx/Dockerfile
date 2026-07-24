FROM debian:bookworm

RUN apt update && apt install -y \
nginx \
openssl \
netcat-openbsd

RUN mkdir -p /etc/nginx/ssl

RUN openssl req -x509 -nodes -days 365 \
-out /etc/nginx/ssl/inception.crt \
-keyout /etc/nginx/ssl/inception.key \
-subj "/C=DE/ST=Hessen/L=Giessen/O=42/OU=42/CN=aisaev.42.fr"

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default
COPY ./tools/setup.sh /setup.sh

RUN chmod +x /setup.sh
CMD ["/setup.sh"]