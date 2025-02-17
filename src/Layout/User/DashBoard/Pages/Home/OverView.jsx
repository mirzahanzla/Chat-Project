import './Index.css';
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ShowComments from './showComments';
import { useNavigate } from 'react-router-dom';

const OverView = () => {
    const [customData, setCustomData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 15;

    const fetchData = async () => {
        try {
            const response = await axios.get('/influencer/allBlogs', {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
                params: { skip, limit },
            });
            const result = response.data;
            const newPosts = result.blogs || [];

            // Filter duplicates
            const uniquePosts = newPosts.filter(post => !customData.some(existingPost => existingPost._id === post._id));

            // Update state with unique posts
            setCustomData(prevData => {
                const combinedPosts = [...prevData, ...uniquePosts];
                const uniquePostsSet = Array.from(new Set(combinedPosts.map(post => post._id)))
                    .map(id => combinedPosts.find(post => post._id === id));
                return uniquePostsSet;
            });
            setHasMore(result.hasMore);
            setSkip(prevSkip => prevSkip + limit);
        } catch (error) {
            setError('Error fetching blog data');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            setLoading(true);
            fetchData();
        }
    }, [hasMore, loading]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="max-w-2xl mx-auto mt-2">
                <div className="h-[1px] bg-black"></div>
                {loading && !customData.length ? (
                    <div className="centered-spinner">
                        <div className="spinner"></div>
                    </div>
                ) : error ? (
                    <div className="text-center mt-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : (
                    <>
                        {customData.map(post => (
                            <Post
                                key={post._id}
                                userImage={post.author.photo}
                                userName={post.author.fullName}
                                postTime={new Date(post.postedAt).toLocaleString()}
                                localTime={post.postedAt}
                                postImage={post.blogMainImg}
                                likesCount={post.likes}
                                postTitle={post.title}
                                postID={post._id}
                                isLiked={post.liked}
                                isSaved={post.saved}
                                commentsCount={post.commentsCount}
                                postBody={post.body}
                            />
                        ))}
                        {hasMore && (
                            <div className="text-center mt-4">
                                <div
                                    onClick={loadMore}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </div>
                            </div>
                        )}
                        {!hasMore && (
                            <div className="text-center mt-4">
                                <p className="text-gray-500 font-semibold">No more posts to load</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

const Post = ({ userImage, userName, postTime, postImage, likesCount, postTitle, postID, isLiked, isSaved, commentsCount, postBody, localTime }) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 'auto', height: 'auto' });
  const [liked, setLiked] = useState(isLiked);
  const [savedPost, setSavedPost] = useState(isSaved);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [likeCount, setLikesCount] = useState(likesCount);
  const [commentCount, setCommentsCount] = useState(commentsCount);
  // const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    setImageDimensions(naturalWidth > naturalHeight 
      ? { width: '100%', height: '300px' } 
      : { width: 'auto', height: '300px' });
  };

  // const [actionLoading, setActionLoading] = useState(false); // Tracks if the API call is in progress

  const handleLike = useCallback(async () => {
      if (actionLoading) return; // Prevent new calls if one is already in progress
  
      setActionLoading(true); // Set loading state to true before making the API call
  
      try {
          const response = await axios.post('/influencer/likePost', { postId: postID }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
  
          console.log("Server like response: ", response.data); // Log server response
  
          if (response.status === 200) {
              setLiked((prevLiked) => !prevLiked); // Toggle the liked state
  
              // Update likeCount based on the new liked state
              setLikesCount((prevLikes) => liked ? prevLikes - 1 : prevLikes + 1);
          }
      } catch (error) {
          setActionError('Error liking the post'); // Optionally handle the error state
          console.error('Error liking post:', error);
      } finally {
          setActionLoading(false); // Reset the loading state after the API call completes
      }
  }, [postID, liked, actionLoading]);

  const handleSavePost = useCallback(async () => {
    if (actionLoading) return; // Prevent new calls if one is already in progress

    setActionLoading(true); // Set loading state to true before making the API call

    try {
        const response = await axios.post('/influencer/savePost', { postId: postID }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });

        console.log("Server save response: ", response.data); // Log server response

        if (response.status === 200) {
            setSavedPost((prevSaved) => !prevSaved); // Toggle the saved state
        }
    } catch (error) {
        setActionError('Error saving the post'); // Optionally handle the error state
        console.error('Error saving post:', error);
    } finally {
        setActionLoading(false); // Reset the loading state after the API call completes
    }
}, [postID, savedPost, actionLoading]);


  const handleMoreDetails = () => {
    navigate('/Dashboard/Post-Details', {
      state: {
        blogPost: {
          imageLink: postImage,
          title: postTitle,
          body: postBody,
          likes: likeCount,
          commentsCount: commentCount,
          id: postID,
          likedStatus: liked
        },
      },
    });
  };

  const postRef = useRef(null);

  const monitorReachCount = async () => {
    try {
      // Check if localTime is a valid string
      if (!localTime || typeof localTime !== 'string') {
        console.error("Invalid localTime:", localTime);
        return; // Exit early if localTime is not valid
      }
  
      // Parse the ISO string to a Date object
      const date = new Date(localTime);
  
      // Extract the year, month, and day
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
  
      // Format as 'YYYY-MM' for yearMonth
      const yearMonth = `${year}-${month}`;
      console.log("Date is: ", yearMonth);
  
      // Send blogId and yearMonth in the request
      await axios.put(
        '/influencer/addReachCount', 
        { blogId: postID, month: yearMonth }, // Payload with blogId and month
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      console.log("Reach count updated successfully");
    } catch (error) {
      console.error("Error updating reach count:", error);
    }
  };  

  const handleScroll = () => {
    if (postRef.current) {
      const rect = postRef.current.getBoundingClientRect();
      const isFullyInView = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (isFullyInView) {
        monitorReachCount();
        // Remove the scroll listener after reaching once
        window.removeEventListener('scroll', handleScroll);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const monitorVisitCount = async () => {
    try {
      // Check if postTime is a valid string
      if (!localTime || typeof localTime !== 'string') {
        console.error("Invalid postTime:", localTime);
        return; // Exit early if postTime is not valid
      }
  
      // Parse the ISO string to a Date object
      const date = new Date(localTime);
  
      // Extract the year, month, and day
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
  
      // Format as 'YYYY-MM' for yearMonth
      const yearMonth = `${year}-${month}`;
      console.log("Date is: ", yearMonth);
  
      // Send blogId and yearMonth in the request
      await axios.put('/influencer/minitorVisitCount', 
        { blogId: postID, month: yearMonth }, // Payload with blogId and month
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      console.log("Visits count updated successfully");
    } catch (error) {
      console.error("Error updating reach count:", error);
    }
  };

  return (
    <div ref={postRef} className="p-4 border border-gray-200 rounded-lg mt-4 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[12px]"
    onClick={monitorVisitCount}>
      <div className="flex items-center justify-between space-x-4 mb-2">
        <div className="flex items-center space-x-2">
          <div className="flex size-[60px] xs:size-[80px] sm:size-[100px] md:size-[60px] items-center border-2 p-[1px] rounded-full">
            <img className="aspect-square Avatar" src={userImage} alt="" />
          </div>
          <div>
            <p className="font-bold text-[14px]">{userName}</p>
            <p className="text-[9px] text-gray-500">{postTime}</p>
          </div>
        </div>
        <div>
          <img src="/Svg/More.svg" alt="more options" className="more-icon bg-orange" />
        </div>
      </div>
      <div className="mx-auto flex justify-center" style={{ maxWidth: '500px', maxHeight: '500px' }}>
        <img
          onClick={handleMoreDetails}
          className="object-right-top object-cover"
          src={postImage}
          alt=""
          style={{ width: imageDimensions.width, height: imageDimensions.height }}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* <div className="flex items-center">
            <div
              className={`focus:outline-none p-0 ${liked ? 'bg-orange' : 'bg-transparent'}`}
              onClick={handleLike}
            >
             <img 
                src={`/Svg/Heart${liked ? '2' : ''}.svg`} // Use filled heart for liked
                className="Avatar size-[15px]" 
                alt="Likes" 
              />
            </div>
            <span className="ml-1">{likeCount}</span>
          </div> */}


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
            <p className="ml-2 font-medium">{likeCount}</p>
          </div>


          <div className="flex items-center">
            <div className="focus:outline-none bg-transparent p-0" onClick={() => setShowComments(true)}>
              <img src="/Svg/Comment2.svg" alt="comment div" className="bg-transparent" />
            </div>
            <span className="ml-1">{commentCount}</span>
          </div>
        </div>
        <div
          className={`focus:outline-none p-0 ${savedPost ? 'bg-blue' : 'bg-transparent'}`}
          onClick={handleSavePost}
        >
          <img src="/Svg/Bookmark2.svg" alt="bookmark div" className="bg-transparent" />
        </div>
      </div>
      {actionError && <p className="text-red-500">{actionError}</p>}
      <div className="mt-2">
        <h2 className="font-bold text-[14px]">{postTitle}</h2>
      </div>
      <form className="mt-1 flex items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full placeholder:text-[11px] outline-none bg-inherit border-b-2 pb-2 border-black/30 focus:ring-0 text-sm"
          onFocus={() => setShowComments(true)}
        />
      </form>

      <ShowComments postID={postID} show={showComments} onClose={() => setShowComments(false)} />
    </div>
  );
};

export default OverView;