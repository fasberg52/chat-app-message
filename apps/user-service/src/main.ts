import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { HttpExceptionFilter } from '@app/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    },
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen();
}
bootstrap();
