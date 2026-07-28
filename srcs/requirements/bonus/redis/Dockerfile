FROM debian:bookworm

RUN apt update && apt install -y redis-server

COPY ./tools/setup.sh /setup.sh

RUN chmod +x /setup.sh

CMD ["/setup.sh"]