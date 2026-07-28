#!/bin/bash

mkdir -p /var/run/vsftpd/empty

if ! id -u "${FTP_USER}" >/dev/null 2>&1; then
    useradd -m -d /var/www/html -s /bin/bash "${FTP_USER}"
    echo "${FTP_USER}:${FTP_PASSWORD}" | chpasswd
    usermod -aG www-data "${FTP_USER}"
fi

chmod -R g+w /var/www/html

exec /usr/sbin/vsftpd /etc/vsftpd.conf