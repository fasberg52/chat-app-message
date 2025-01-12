FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build notification-service

EXPOSE 6000

CMD ["npm", "run", "start:dev", "notification-service"]