import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const monthsBack = 6;

        const response = await axios.get(`/Brand/blogs?monthsBack=${monthsBack}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });

        const result = response.data;

        const blogs = result.map(item => item.blogs);
        setPosts(blogs);
      } catch (err) {
        setError('Error fetching blogs');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    console.log('Posts updated:', posts); 
  }, [posts]);

  return (
    <>
      <div className="sm:w-[500px] mdm:w-[600px] lg:w-[900px] mx-auto pt-5 h-screen">
        <div
          className="flex justify-end cursor-pointer mb-5"
          onClick={() => navigate('CreateBlog')}
        >
          <img src="/Svg/Write.svg" alt="Write" />
        </div>
        <div className="space-y-5">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            posts.length === 0 ? (
              <p>No blogs available.</p>
            ) : (
              posts.map((post) => (
                <BlogPost
                  key={post._id}
                  blogID={post._id}
                  Title={post.title}
                  Body={post.body}
                  Time={new Date(post.postedAt).toLocaleTimeString()}
                  Image={post.blogMainImg}
                />
              ))
            )
          )}
        </div>
      </div>
    </>
  );
};

const BlogPost = ({ Title, Body, Time, Image, blogID }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // State to show confirmation dialog
  const [loading, setLoading] = useState(false); // State to show loading spinner
  const truncatedBody = Body.length > 250 ? Body.substring(0, 250) + '...' : Body;
  const navigate = useNavigate();
 const menuRef =useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the menuRef exists and does not contain the clicked target
      // Also check if the clicked target is not the "More" icon
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) 
     
      ) {
        setShowMenu(false);
      }
    };
  
    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);
  
    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array to add listener only once



  // Handle edit action
  const handleEdit = () => {
    navigate(`/Blog/EditBlog/${blogID}`, {
      state: { title: Title, body: Body, image: Image, blogID: blogID }
    });
  };

  const handleDelete = async () => {
    setShowConfirm(false); // Hide confirmation dialog
    setLoading(true); // Show loading spinner
    try {
      await axios.delete(`/Brand/deletePost/${blogID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      window.location.reload(); // Refresh the page after deletion
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="bg-white mx-auto sm:w-[500px] mdm:w-[600px] lg:w-[700px] rounded-xl p-2 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] relative">
      <div className="p-2 grid grid-cols-12">
        <div className="col-span-9">
          <p className="text-[12px] mdm:text-lg lato-bold">{Title}</p>
          <p className="poppins-regular mt-1">
            {isExpanded ? Body : truncatedBody}
            {Body.length > 250 && (
              <span
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-orange-500 cursor-pointer"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </span>
            )}
          </p>
          <div className="flex justify-between mt-2">
            <p className="text-black/50">{Time}</p>
            <div className="relative">
              <img
                src="/Svg/More.svg"
                alt="More"
                className="cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50" ref={menuRef}>
                  <ul>
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleEdit}
                    >
                      Edit
                    </li>
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setShowConfirm(true)} // Show confirmation dialog
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-3 flex justify-center items-center">
          <div className="flex size-[60px] xs:size-[80px] sm:size-[100px] md:size-[100px] items-center rounded-lg overflow-hidden">
            <img className="aspect-square Avatar-v1" src={Image} alt="Blog Post" />
          </div>
        </div>
      </div>

      {/* Confirmation Pop-up */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <p>Are you sure you want to delete this blog?</p>
            <div className="flex justify-end mt-3">
             
                <div className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg flex justify-center mx-3 cursor-pointer"  onClick={handleDelete}>Yes</div>
                <div className="w-full text-primary border-primary border-2 flex justify-center items-center px-4 rounded-lg outline-2 mx-3 cursor-pointer"  onClick={() => setShowConfirm(false)}>Cancel</div>
             
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="spinner-border text-white" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;