#build environment
FROM node:12.2.0-alpine as build

RUN mkdir -p /srv/app/client
WORKDIR /srv/app/client

COPY package.json /srv/app/client
COPY package-lock.json /srv/app/client

RUN npm install

COPY . /srv/app/client

ARG API_ENDPOINT

RUN echo "REACT_APP_API=$API_ENDPOINT" > .env

RUN npm run build

#production environment
FROM nginx:stable-alpine

COPY config/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /srv/app/client/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
