// components/BlogPostCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Edit, Trash } from "lucide-react"; // Added icons for edit and trash
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditPostModal } from "./edit-post-modal";
import { DeletePostModal } from "./delete-post-modal";
import { CreatePostModal } from "./create-post-modal";
import { useState } from "react";
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
  onDeleteSuccess: () => void;
  onUpdateSuccess: () => void; 
}

const BlogPostCard = ({
  post,
  onClick,
  onDeleteSuccess,
  onUpdateSuccess
}: BlogPostCardProps) => {
  const pathname = usePathname(); // Get the current pathname
    const [isEditModalOpen,setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false)
    const [postContent, setPostContent] = useState(post);
    const handleEditSubmit = (newContent: string) =>{
        setPostContent(post)
    }
const handleDelete=()=>{
    setIsDeleteModalOpen(false)
}


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

  
            <div className="flex items-center text-slate-500 text-sm">
                <div className="cursor-pointer" onClick={onClick}>
              <MessageSquare  className="h-4 w-4 mr-1" />
              </div>
              {post.comments > 0 && (
              <span>{post.comments} Comments</span>      )}
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
