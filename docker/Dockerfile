FROM nginx:latest

# Install Certbot
RUN apk add python3 python3-dev py3-pip build-base libressl-dev musl-dev libffi-dev
RUN pip3 install pip --upgrade
RUN pip3 install certbot-nginx
RUN mkdir /etc/letsencrypt

# Copy Website
COPY /out/ /usr/share/nginx/html

# Copy Nginx's configuration for the server
COPY default.conf /etc/nginx/conf.d/default.conf


EXPOSE 80 443

VOLUME /etc/letsencrypt
VOLUME /var/www/certbot

LABEL maintainer="guillermolam.m@gmail.com"