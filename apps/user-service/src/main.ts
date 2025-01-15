import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { MicroExceptionFilter } from '@app/common/filters/rpc-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL],
        queue: process.env.USER_SERVICE_HOST,
        queueOptions: {
          durable: false,
        },
      },
    } as RmqOptions,
  );

  app.useGlobalFilters(new MicroExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen();
  console.log(`user service running port 3001`);
}
bootstrap();
