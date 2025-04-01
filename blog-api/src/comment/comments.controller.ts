import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('blogs/:blogId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Create a new comment
  @Post()
  async create(
    @Param('blogId') blogId: number, // Get the blogId from the URL parameter
    @Body() createCommentDto: CreateCommentDto, // Comment content from the request body
  ): Promise<Comment> {
    // Attach the blogId to the DTO before saving the comment
    createCommentDto.blogId = blogId;
    return this.commentService.create(createCommentDto);
  }

  // Fetch all comments for a specific blog
  @Get()
  async findAll(@Param('blogId') blogId: number): Promise<Comment[]> {
    return this.commentService.findAll(blogId);
  }

  // Delete a comment by its ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.commentService.remove(id);
  }
}
