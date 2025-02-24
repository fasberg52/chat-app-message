import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config as dotenvConfig } from 'dotenv';
import { SwaggerHelper } from './helper/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
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
