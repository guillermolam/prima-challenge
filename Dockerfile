FROM nginx:alpine
LABEL maintainer="guillermolam.m@gmail.com"

EXPOSE 80 
EXPOSE 443

USER root

# Copy Website
COPY ./out /usr/share/nginx/html

# Copy TLS Certificate and Key
COPY ./infra-pulumi-dynamic/certificates /etc/nginx/certs

# Copy Nginx's configuration for the server
COPY default.conf ./etc/nginx/conf.d/default.conf

