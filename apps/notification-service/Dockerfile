FROM node:22
WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build notification-service

EXPOSE 3003

CMD ["npm", "run", "start:notification-service"]
