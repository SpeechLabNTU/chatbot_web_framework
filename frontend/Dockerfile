#build environment
FROM node:12.2.0-alpine as build

RUN mkdir -p /srv/app/client
WORKDIR /srv/app/client

COPY package.json /srv/app/client
COPY package-lock.json /srv/app/client

RUN npm install

COPY . /srv/app/client

RUN echo "REACT_APP_API=http://localhost:3001" > .env

RUN npm run build

#production environment
FROM nginx:stable-alpine

COPY --from=build /srv/app/client/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
