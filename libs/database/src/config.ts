import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  database: process.env.DATABASE_NAME || 'chat',
  password: `${process.env.DATABASE_PASSWORD}` || '2434127reza',
  entities: [__dirname + '/entities/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
