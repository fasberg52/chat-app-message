FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force
COPY . .

RUN npm run build messaging-service

EXPOSE 3002

CMD ["npm", "run", "start:dev", "messaging-service"]

