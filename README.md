# Final Year Project FAQ Chatbot Framework for Response Comparisons and Performance Analysis

# Docker Setup for Production
This branch is configured for production level deployments of the framework. The branch will consist of three image build folder (Frontend, Backend, Comparison) and a docker compose folder to orchestrate the builds of each image.

Each image build folder will contain its respective Dockerfiles configured for production builds.

# Requirements
To build/configure a production image, Docker client must be present on the local system to be able to spawn a docker image. Download Docker client here https://www.docker.com/

# Docker basic commands
**docker image ls**: List available/downloaded Docker images
**docker container ls -a**: List containers(runnable images)
**docker build -t app:tag .**: Build application based on Docker file configuration
**docker run -d -p port:port app:tag**: Running a application after build
**docker /start/stop/restart [container ID]**: Start/Stop/Restart containers
**docker system prune -a**: Delete all containers
**docker rm [container ID]**: Remove specific container
**docker rmi [image ID]**: Remove specific image
**docker exec -it [container ID] /bin/bash**: Access container operating system

# Instructions to spin up a Production build
1. CD into the *compose* directory
2. RUN *docker-compose build* to start Dockerfile builds from each image directory
3. RUN *docker-compose up* to bring up all build instances
4. Default application is hosted on http://localhost:3000
5. Port and endpoint changes can be configured in the *.env* file in the same directory

# Pushing production build to dockerhub for sharing
1. **docker tag [build image ID] dockerid/dockerhubrepo:tag**: Tags image for naming in Dockerhub
2. **docker push dockerid/dockerhubrepo:tag**: Push image to Dockerhub
