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
        host: '0.0.0.0',
        port: 3002,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log('Messaging service is running on port 3002');
}
bootstrap();
