import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShowComments from '../Home/showComments';

const ShowBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const { blogPost } = location.state || {};
  console.log("Blogs: ", blogPost);
  
  const [isLoading, setIsLoading] = useState(false); // State to track if the API is being called
  const [liked, setLiked] = useState(blogPost.likedStatus);  // Initialize with the liked status
  const [likesCount, setLikesCount] = useState(blogPost.likes); // Initialize with the likes count

  if (!blogPost) {
    console.log("blogPost is empty", blogPost);
    return null;
  }

  const handleClose = () => {
    navigate(-1);  // Navigate back to the previous page
  };

 

const handleLike = async () => {
  if (isLoading) return; // Prevent a new call if the API is already being called

  setIsLoading(true); // Set loading state to true before making the API call

  try {
    await axios.post('/influencer/likePost', { postId: blogPost.id }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });

    setLiked(prevLiked => !prevLiked); // Toggle the like status
    setLikesCount(prevLikes => liked ? prevLikes - 1 : prevLikes + 1); // Adjust like count based on the new liked status
  } catch (error) {
    console.error('Error liking post:', error);
  } finally {
    setIsLoading(false); // Set loading state to false after the API call is complete
  }
};

  return (
    <div className="bg-white mdm:w-[700px] md:w-[800px] lg:w-[900px] rounded-xl mx-auto mt-2 p-2 pr-5 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[12px]">
      <div className="flex justify-end h-[34px] space-x-3">
        <img 
          src="/Svg/Close.svg" 
          alt="Close" 
          className="cursor-pointer" 
          onClick={handleClose}  // Add onClick handler to the close button
        />
      </div>

      {/* Blog Image */}
      <div className="mt-10 w-[300px] flex mdm:h-[200px] mdm:w-[500px] md:h-[300px] md:w-[500px] mx-auto overflow-hidden md:items-center justify-center">
        <img className="aspect-square Avatar-v1" src={blogPost.imageLink} alt="Blog Post" />
      </div>

      {/* Blog Post Details */}
      <div className="ml-5 xs:ml-10 sm:ml-24 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[12px]">
        <p className="poppins-semibold mt-5 text-[16px]">{blogPost.title}</p>
        <div className="mt-2">
          <p className="text-black/50">Content</p>
          <p className="font-medium">{blogPost.body}</p>
        </div>

        {/* Blog Post Statistics */}
        <div className="mt-5 flex items-center space-x-4 xs:w-[300px] sm:w-[500px] md:w-[650px]">
          <div className="flex items-center">
              <button
                className={`focus:outline-none p-0 ${liked ? 'bg-orange' : 'bg-transparent'}`} 
                onClick={handleLike}
              >
              <img 
                src={`/Svg/Heart${liked ? '2' : ''}.svg`} // Use filled heart for liked
                className="Avatar size-[15px]" 
                alt="Likes" 
              />
            </button>
            <p className="ml-2 font-medium">{likesCount}</p>
          </div>
          <div className="flex items-center" onClick={() => setShowComments(true)}>
            <img src="/Svg/Comment.svg" className="Avatar size-[15px]" alt="Comments" />
            <p className="ml-2 font-medium">{blogPost.commentsCount}</p>
          </div>
        </div>
      </div>
      <ShowComments postID={blogPost.id} show={showComments} onClose={() => setShowComments(false)} />
    </div>
  );
};

export default ShowBlog;