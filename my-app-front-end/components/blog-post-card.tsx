// components/BlogPostCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Edit, Trash } from "lucide-react"; // Added icons for edit and trash
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditPostModal } from "./edit-post-modal";
import { DeletePostModal } from "./delete-post-modal";
import { CreatePostModal } from "./create-post-modal";
import { useState,useEffect} from "react";
import { Comment } from "@/app/types/type";
interface BlogPostCardProps {
  post: {
    id: number;
    author: string;
    avatar: string;
    category: string;
    title: string;
    excerpt: string;
    comments: number;
    content: string;
    timeAgo: string
  };
  onClick: () => void;
  onDeleteSuccess?: () => void;
  onUpdateSuccess?: () => void; 
  onCommentSuccess?: () => void;  // Add onCommentSuccess prop here
  
}

const BlogPostCard = ({
  post,
  onClick,
  onDeleteSuccess,
  onUpdateSuccess,
  onCommentSuccess,
}: BlogPostCardProps) => {
  const pathname = usePathname(); // Get the current pathname
    const [isEditModalOpen,setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false)
    const [postContent, setPostContent] = useState(post);
    const [comments, setComments] = useState<Comment[]>([]); // Added state for comments
    const handleEditSubmit = (newContent: string) =>{
        setPostContent(post)
    }
const handleDelete=()=>{
    setIsDeleteModalOpen(false)
}


useEffect(() => {
    if (post.id) {
      const fetchComments = async () => {
        try {
  
          const response = await fetch(`http://localhost:3001/blogs/${post.id}/comments`);
          if (!response) {
            console.error("No response received from server.");
            setComments([]);
            return;
          }

          if (response.status === 404 || response.status === 204) {
            console.log("No comments yet for this blog post.");
            setComments([]);
            return;
          }

          if (!response.ok) {
            console.error("Failed to fetch comments. Status:", response.status);
            setComments([]);
            return;
          }

          const data = await response.json();
          if (data && Array.isArray(data)) {
            setComments(data);
          } else {
            console.log("No comments yet for this blog post.");
            setComments([]);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
          setComments([]);
        }
      };

      fetchComments();
    }
  }, [post.id,onCommentSuccess]);

  // Number of comments is now available as comments.length
  const commentCount = comments.length;

  // Check if on the "/ourblog" page
  const isOurBlogPage = pathname === "/ourblog";
  return (
    <div
      className="block p-6 "

    >
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={post.avatar} alt={post.author} />
          <AvatarFallback>{post.author[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 justify-between">
            <span className="font-medium">{post.author}</span>
            {isOurBlogPage && (
              <div className=" flex gap-2">
                <div
                  onClick={(e) => {
    
                    setIsEditModalOpen(true) // Prevents interaction with the blog post itself
                  }}
                  className="flex items-center gap-1 text-sm text-black cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </div>

                <div
                  onClick={(e) => {
               
                    setIsDeleteModalOpen(true) // Prevents interaction with the blog post itself
                  }}
                  className="flex items-center gap-1 text-sm text-black cursor-pointer ml-3"
                >
                  <Trash className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
          <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1">
            {post.category}
          </span>

          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-slate-600 mb-3 line-clamp-2">{post.content}</p>

  
            <div className="flex items-center text-slate-500 text-sm cursor-pointer" onClick={onClick}>
                <div >
              <MessageSquare  className="h-4 w-4 mr-1" />
              </div>
           
              <span>{commentCount} Comments</span>    
            </div>
    

          {/* Conditionally render Edit and Delete buttons */}
        </div>
        <DeletePostModal isOpen={isDeleteModalOpen} onClose={()=>setIsDeleteModalOpen(false)} onDelete={handleDelete}     onDeleteSuccess={onDeleteSuccess} itemId={post.id}/>
        <EditPostModal isOpen={isEditModalOpen} onClose={()=>setIsEditModalOpen(false)} onSubmit={handleEditSubmit}  onUpdateSuccess={onUpdateSuccess} itemId={post.id}  post={post}/>
      </div>



    </div>
  );
};

export default BlogPostCard;
