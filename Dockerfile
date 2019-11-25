FROM node

WORKDIR /web-app

COPY package.json /web-app

RUN npm install
COPY . /web-app

CMD node src/app.js
EXPOSE 8080
