import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { BlogsModule } from './blog/blogs.module';  // Adjust according to your project structure
import { Blog } from './blog/entities/blog.entity';  // Adjust according to your project structure
import { Comment } from './comment/entities/comment.entity';
import { CommentsModule } from './comment/comments.module';
import { DatabaseService } from './db/database.service';

// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    // Load environment variables globally across the application
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '..', '.env'),  // Ensure correct path to .env file
      isGlobal: true,  // Makes environment variables globally accessible
    }),
    // Set up TypeORM module with PostgreSQL configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,  // Use the value from the .env file
      port: parseInt(process.env.DB_PORT || '5432', 10),  // Default to '5432' if DB_PORT is undefined
      username: process.env.DB_USERNAME,  // Use the value from the .env file
      password: process.env.DB_PASSWORD,  // Use the value from the .env file
      database: process.env.DB_NAME,  // Use the value from the .env file
      entities: [Blog, Comment],  // Add your entities here
      synchronize: true,  // Automatically sync schema (use with caution in production)
    }),
    // Import your modules (BlogsModule and CommentsModule)
    BlogsModule,
    CommentsModule,
  ],
  providers: [DatabaseService],  // Add DatabaseService to providers array
})
export class AppModule {}
