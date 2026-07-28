FROM debian:bookworm

RUN apt update && apt install -y nginx

RUN rm -f /etc/nginx/sites-enabled/default

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./site /var/www/static

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]