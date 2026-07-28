FROM debian:bookworm

RUN apt update && apt install -y vsftpd

COPY ./conf/vsftpd.conf /etc/vsftpd.conf
COPY ./tools/setup.sh /setup.sh
RUN chmod +x /setup.sh

EXPOSE 21 21100-21110

CMD ["/setup.sh"]