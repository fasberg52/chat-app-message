import { NestFactory } from '@nestjs/core';
import { MessagingServiceModule } from './messaging-service.module';
import { MicroserviceOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessagingServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL],
        queue: process.env.MESSAGE_SERVICE_HOST,
        queueOptions: {
          durable: false,
        },
      },
    } as RmqOptions,
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
