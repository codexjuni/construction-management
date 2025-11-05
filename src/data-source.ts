import 'dotenv/config';
import { DataSource } from 'typeorm';

// Log out the database URL for debugging (safe to do locally)
console.log("Using DB URL:", process.env.DATABASE_URL);

// Parse and log the username so we can confirm it's correct
const parsedUrl = new URL(process.env.DATABASE_URL ?? "");
console.log("USERNAME BEING USED:", parsedUrl.username);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});
