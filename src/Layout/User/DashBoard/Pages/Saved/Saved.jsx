import { useState, useEffect } from 'react';
import axios from 'axios';
import Report from './Report';

const Content = () => {
  const [showReportForm, setShowReportForm] = useState(false); // State to toggle report form visibility

  const toggleReportForm = () => {
    setShowReportForm((prev) => !prev); // Toggle the report form visibility
  };

  return (
    <>
      <div className="w-full max-w-[1200px] mx-auto pt-5 px-4">
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div
            onClick={toggleReportForm}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-5"
          >
            Report
          </div>
          {showReportForm && <Report />}
          <h3 className="text-3xl font-bold mb-6">Saved Posts</h3>
          <Media />
        </div>
      </div>
    </>
  );
};

const Media = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await axios.get('/influencer/savedBlogs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}` // Adjust according to your auth token storage
          }
        });
        setSavedPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      } finally {
        setLoading(false); // Set loading to false when fetching completes
      }
    };

    fetchSavedPosts();
  }, []);

  return (
    <div className="bg-gray-100 rounded-3xl p-6 mt-5">
      {loading ? (
        <div className="centered-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {savedPosts.length ? (
            savedPosts.map((post, index) => (
              <ProfileMedia
                key={index}
                PostImageSrc={post.blogMainImg}
                ProfileImage={post.author.photo}
                name={post.author.fullName}
                Likes={post.likes}
                Comments={post.commentsCount}
                title={post.title}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-[300px]">
              <p className="text-gray-500 text-lg font-semibold">You have no saved posts yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProfileMedia = ({ PostImageSrc, ProfileImage, name, Likes, Comments, title }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      <img className="w-full h-40 object-cover" src={PostImageSrc} alt={title} />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center space-x-3">
          <img src={ProfileImage} className="w-12 h-12 rounded-full" alt={name} />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">{name}</p>
            <div className="flex space-x-4 text-sm">
              <p className="flex items-center space-x-1">
                <img src="/Svg/Heart.svg" className="w-4 h-4" alt="likes" />
                <span>{Likes}</span>
              </p>
              <p className="flex items-center space-x-1">
                <img src="/Svg/Comment.svg" className="w-4 h-4" alt="comments" />
                <span>{Comments}</span>
              </p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-gray-700">{title}</p>
      </div>
    </div>
  );
};

export default Content;