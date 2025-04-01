import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { Blog } from '../blog/entities/blog.entity';  // Assuming you have a Blog entity

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Blog])], // Register entities for TypeORM
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentsModule {}
