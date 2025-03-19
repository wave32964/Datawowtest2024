// components/BlogPostList.tsx
import BlogPostCard from "./blog-post-card";

interface BlogPostListProps {
  posts: {
    id: number;
    author: string;
    avatar: string;
    category: string;
    title: string;
    excerpt: string;
    content:string;
    comments: number;
    timeAgo: string
  }[];
  onPostClick: (postId: number) => void;
  onDeleteSuccess?: () => void; // Callback when a post is deleted
  onUpdateSuccess?: () => void; // Callback when a post is updated
}


const BlogPostList: React.FC<BlogPostListProps> = ({ posts, onPostClick , onDeleteSuccess, onUpdateSuccess}) => {
  return (
    <div className="bg-white rounded-2xl">
      {posts.map((post, index) => (
        <div key={post.id}>
          <BlogPostCard post={post}   onUpdateSuccess={onUpdateSuccess}   onDeleteSuccess={onDeleteSuccess}  onClick={() => onPostClick(post.id)} />
          {index < posts.length - 1 && (
            <div className="w-full h-px bg-gray-300 my-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogPostList;
