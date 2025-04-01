import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // Fetch all comments by blogId
  async findAll(blogId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { blogId } });
  }

  // Create a new comment
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  // Delete a comment by ID
  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
