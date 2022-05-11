FROM node:17-alpine
EXPOSE 3000

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
