// components/BlogPostList.tsx
import BlogPostCard from "./blog-post-card";

interface BlogPostListProps {
  posts: {
    id: string;
    author: string;
    avatar: string;
    category: string;
    title: string;
    excerpt: string;
    content:string;
    comments: number;
  }[];
  onPostClick: (postId: string) => void;
}


const BlogPostList: React.FC<BlogPostListProps> = ({ posts, onPostClick }) => {
  return (
    <div className="bg-white rounded-2xl">
      {posts.map((post, index) => (
        <div key={post.id}>
          <BlogPostCard post={post} onClick={() => onPostClick(post.id)} />
          {index < posts.length - 1 && (
            <div className="w-full h-px bg-gray-300 my-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogPostList;
