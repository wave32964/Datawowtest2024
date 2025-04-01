import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './db/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow requests from the frontend (Next.js)
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from Next.js running on port 3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  if (process.argv.includes('setup')) {
  // Get an instance of DatabaseService and call runSQLFile
  const databaseService = app.get(DatabaseService);
  await databaseService.runSQLFile(); // This will run your SQL file on startup
  }
  // NestJS will now listen on port 3001
  await app.listen(3001);
}

bootstrap();
