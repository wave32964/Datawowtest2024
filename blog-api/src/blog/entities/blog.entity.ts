import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  author: string | null;  // Make it nullable

  @Column({ nullable: true, type: 'varchar', length: 255 })
  avatar: string | null;  

  @Column({ nullable: true, type: 'varchar', length: 100 })
  category: string | null;  

  @Column({ nullable: true, type: 'varchar', length: 255 })
  title: string | null;  

  @Column({ nullable: true, type: 'text' })
  excerpt: string | null;  

  @Column({ nullable: true, type: 'text' })
  content: string | null; 

  @Column({ nullable: true, type: 'varchar', length: 255 })
  comments: string | null; 

  @Column({ nullable: true, type: 'varchar', length: 50 })
  timeago: string | null;  

  constructor(
    author: string | null = null,
    avatar: string | null = null,
    category: string | null = null,
    title: string | null = null,
    excerpt: string | null = null,
    content: string | null = null,
    comments: string | null = null,
    timeago: string | null = null
  ) {
    this.author = author;
    this.avatar = avatar;
    this.category = category;
    this.title = title;
    this.excerpt = excerpt;
    this.content = content;
    this.comments = comments;
    this.timeago = timeago;
  }
}
