echo "Login to Docker Hub"
docker login --username=guillermolam
echo "Building Nginx image"
docker build . -t guillermolam/prisma-nginx:latest
echo "Pushing Nginx image to Docker Hub"
docker push guillermolam/prisma-nginx:latest