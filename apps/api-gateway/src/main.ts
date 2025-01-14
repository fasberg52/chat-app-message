import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { config as dotenvConfig } from 'dotenv';
import { SwaggerHelper } from './helper/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      prefetchCount: 1,
      persistent: true,
      queueOptions: {
        durable: true,
      },
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  new SwaggerHelper().setup(app);

  await app.startAllMicroservices();
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3000);
  console.log(`API gateway is running on http://localhost:3000`);
}
bootstrap();
