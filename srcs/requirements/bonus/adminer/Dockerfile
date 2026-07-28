FROM debian:bookworm

RUN apt update && apt install -y php php-mysqli wget

RUN mkdir -p /var/www/adminer

RUN wget -O /var/www/adminer/index.php \
    https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1.php

WORKDIR /var/www/adminer

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80"]
    