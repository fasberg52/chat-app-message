import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerHelper } from '@app/shared/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 3000 },
  });

  new SwaggerHelper().setup(app);
  app.enableCors({ origin: true, credentials: true });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`API gateway is running on http://localhost:${process.env.PORT}`);
}
bootstrap();
