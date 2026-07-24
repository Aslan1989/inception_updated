#!/bin/bash

until nc -z wordpress 9000;
do
    echo "Waiting for WordPress..."
    sleep 2
done

echo "WordPress is ready!"

exec nginx -g "daemon off;"