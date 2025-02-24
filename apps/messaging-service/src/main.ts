import { NestFactory } from '@nestjs/core';
import { MessagingServiceModule } from './messaging-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessagingServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.PUBLIC_HOST,
        port: parseInt(process.env.MESSAGE_SERVICE_PORT),
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
