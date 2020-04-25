FROM node:12.2.0-alpine

RUN mkdir -p /srv/app/server
WORKDIR /srv/app/server

COPY package.json /srv/app/server
COPY package-lock.json /srv/app/server

RUN npm install

COPY . /srv/app/server

RUN apk add --no-cache --virtual .build-deps g++ python3-dev libffi-dev openssl-dev && \
    apk add --no-cache --update python3 && \
    pip3 install --upgrade pip setuptools

RUN pip3 install -r requirements.txt

RUN tar -xvzf ./gcloud/google-cloud-sdk-281.0.0-linux-x86_64.tar.gz

RUN CLOUDSDK_CORE_DISABLE_PROMPTS=1 ./google-cloud-sdk/install.sh

ENV PATH $PATH:/srv/app/server/google-cloud-sdk/bin

ARG KEY
ARG PROJECTID

RUN gcloud auth activate-service-account dialogflowadmin@chatbot-development-250810.iam.gserviceaccount.com --key-file /srv/app/server/key/$KEY
RUN gcloud config set project $PROJECTID

ENV GCLOUD_PROJECT=$PROJECTID \
    GOOGLE_APPLICATION_CREDENTIALS=/srv/app/server/key/$KEY
ENV ENV="/etc/profile"

RUN npm install -g pm2
CMD ["pm2-runtime","ecosystem.config.js"]

# CMD ["npm", "run", "dev"]