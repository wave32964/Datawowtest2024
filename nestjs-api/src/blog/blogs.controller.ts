import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Controller('blogs')  // This means all routes will start with /blogs
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()  // POST /blogs
  async createBlog(@Body() createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.blogsService.create(createBlogDto);
  }

  

  @Get()  // GET /blogs (get all blogs)
  async getAllBlogs(): Promise<Blog[]> {
    return this.blogsService.findAll();
  }

  @Get(':id')  // GET /blogs/:id (get a blog by id)
  async getBlogById(@Param('id') id: number): Promise<Blog> {
    return this.blogsService.findOne(id);
  }

  @Put(':id')  // PUT /blogs/:id (update a blog by id)
  async updateBlog(
    @Param('id') id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')  // DELETE /blogs/:id (delete a blog by id)
  async deleteBlog(@Param('id') id: number): Promise<void> {
    return this.blogsService.remove(id);
  }
}
