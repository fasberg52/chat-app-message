import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config as dotenvConfig } from 'dotenv';
import { SwaggerHelper } from './helper/swagger';
import { ValidationPipe } from '@nestjs/common';

dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 3009 },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  new SwaggerHelper().setup(app);

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(`API gateway is running on http://localhost:3000`);
}
bootstrap();
