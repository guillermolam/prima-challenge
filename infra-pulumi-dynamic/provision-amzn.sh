#!/bin/bash
sudo yum install ec2-instance-connect
#perform a quick update on your instance:
sudo yum update -y

#install docker
sudo amazon-linux-extras install docker

#start docker
sudo service docker start

#pull and run container
docker pull nginx:alpine

docker run --name -nginx -d -p 8080:80 nginx
#certbot --nginx -d guillermolammartin.com -d www.guillermolammartin.com
#docker run -v $(pwd)/letsencrypt:/etc/letsencrypt --name prisma-nginx -ti -p 8080:80 nginx-certbot sh`;