export interface Post {
    id?: number
    author: string
    avatar: string
    category: string
    title: string
    excerpt: string
    content: string
    comments: number
    timeAgo: string
  }

  export interface Comment {
    id?: number;
    blog_id: number;
    author: string;
    avatar: string;
    content: string;
    timeAgo: string;
  }
  
