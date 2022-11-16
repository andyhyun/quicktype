FROM node:lts-alpine

WORKDIR /backend_source

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]
