import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ShowComments = ({ postID, show, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [hasMore, setHasMore] = useState(false); // State for pagination
  const [page, setPage] = useState(1); // State to track the current page
  const commentsRef = useRef(null);

  useEffect(() => {
    if (show) {
      fetchComments(page); // Fetch comments when the component is shown or page changes
    }
  }, [show, postID, page]);

  const fetchComments = async (currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Authorization token is missing');
      }

      const response = await axios.get(`/Brand/getComments/${postID}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          page: currentPage,
        },
      });

      console.log('API Response:', response.data);

      const fetchedComments = response.data?.comments || [];

      // Filter out duplicates based on comment body and userName
      const uniqueComments = fetchedComments.filter((newComment) => {
        return !comments.some((existingComment) =>
          existingComment.body === newComment.body && existingComment.userName === newComment.userName
        );
      });

      setComments((prevComments) => [...prevComments, ...uniqueComments]); // Append new unique comments
      setHasMore(response.data.hasMore); // Update hasMore based on the response
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Error fetching comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') return;

    try {
      await axios.post(
        `/influencer/addComment/${postID}`,
        { body: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setNewComment(''); // Clear input field
      // setComments([]); // Reset comments to fetch fresh data
      setPage(1); // Reset page to 1 to fetch the first page
      fetchComments(1); // Fetch comments again
    } catch (err) {
      setError('Error adding comment');
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment the page number to load more comments
    }
  };

  return (
    <>
      {show && (
        <div className='bg-gray-100  flex items-center justify-center'>

          <div
            className={` w-full bg-opacity-50  transition-transform duration-500 ${show ? 'translate-y-0' : 'translate-y-full'
              } z-50`}
            
          >
            <div className="flex flex-col h-full text-black  bg-opacity-80">
              <div className="p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Comments</h2>
                
                <div className="hover:cursor-pointer" onClick={onClose}>
                  <img src="/Svg/Close.svg" alt="Close"/>
                  </div>
              </div>

              <div
                ref={commentsRef}
                className="overflow-y-scroll flex-1 p-4"
                style={{ paddingBottom: '64px' }}
              >
                {loading ? (
                  <p className="">Loading comments...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : comments.length > 0 ? (
                  <>
                    {comments.map((comment, index) => (
                      <div key={index} className="mb-4">
                        <p className="font-semibold">{comment.userName}</p>
                        <p className="text-sm ">{comment.body}</p>
                      </div>
                    ))}
                    {hasMore && (
                      <button onClick={handleLoadMore} className="text-blue-500">
                        Load More Comments
                      </button>
                    )}
                  </>
                ) : (
                  <p className="">No comments available</p>
                )}
              </div>

              <div className="p-4 border-t  flex items-center">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={handleCommentChange}
                  className="w-full px-4 py-2 border rounded-lg border-[#F97316]"
                />
                <div onClick={handleCommentSubmit} className="ml-2">
                  <img src='Svg/Send.svg' alt="Send" className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default ShowComments;