import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments') // Ensure the table name matches the database
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })  // Allowing null values for 'author'
  author!: string;

  @Column({ nullable: true })  // Allowing null values for 'avatar'
  avatar!: string;

  @Column({ nullable: true })  // Allowing null values for 'content'
  content!: string;

  @Column({ nullable: true })  // Allowing null values for 'timeago'
  timeago!: string;

  @Column({ name: 'blogid', nullable: true })  // Allowing null values for 'blogid'
  blogId!: number;  // Using the correct column name, "blogid" instead of "blogId"
}
