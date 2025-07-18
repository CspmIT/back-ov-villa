FROM node:20.15.0-alpine3.20
WORKDIR /usr/src/app

ARG SECRET
ARG DB_USER
ARG DB_HOST
ARG DB_PASS
ARG DB_PORT

ENV DB_USER=$DB_USER
ENV DB_HOST=$DB_HOST
ENV DB_PASS=$DB_PASS
ENV DB_PORT=$DB_PORT
ENV SECRET=$SECRET
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4000
CMD [ "node", "index.js"]