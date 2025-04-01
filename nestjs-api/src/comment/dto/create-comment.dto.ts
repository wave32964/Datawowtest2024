import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  @IsNotEmpty()
  blogId!: number;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsString()
  @IsNotEmpty()
  avatar!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  timeago!: string;
}
