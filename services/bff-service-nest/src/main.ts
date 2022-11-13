import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port || 4002);
}

bootstrap().then(() => console.log('App is running on %s port', port));
