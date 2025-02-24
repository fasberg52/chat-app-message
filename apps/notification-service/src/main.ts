import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import {
  MicroserviceOptions,
  TcpOptions,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { MicroExceptionFilter } from '@app/common/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.PUBLIC_HOST,
        port: parseInt(process.env.NOTIFICATION_SERVICE_PORT),
      },
    } as TcpOptions,
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
  console.log(
    `notification service running port ${process.env.NOTIFICATION_SERVICE_PORT}`,
  );
}
bootstrap();
