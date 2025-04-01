import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments') // Ensure the table name matches the database
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  author!: string;

  @Column()
  avatar!: string;

  @Column()
  content!: string;

  @Column({ nullable: true })
  timeago!: string;

  @Column({ name: 'blogid', nullable: true })  // Ensure the column name matches the database
  blogId!: number;  // Using the correct column name, "blogid" instead of "blogId"
}
