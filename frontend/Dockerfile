FROM node:12.2.0-alpine

RUN mkdir -p /srv/app/client
WORKDIR /srv/app/client

COPY package.json /srv/app/client
COPY package-lock.json /srv/app/client

RUN npm install

COPY . /srv/app/client

ARG API_ENDPOINT
ENV API_ENDPOINT $API_ENDPOINT

CMD ["npm", "start"]