FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
 
ENV PORT=8888

EXPOSE 8888

CMD ["node", "./src/http.js"]
