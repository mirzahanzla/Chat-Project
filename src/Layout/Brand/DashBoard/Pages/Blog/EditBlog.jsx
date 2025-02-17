import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EditBlog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postID = location.state?.blogID;

  console.log("Post id is: ", postID);
  
  const [blogData, setBlogData] = useState({
    title: location.state?.title || '',
    body: location.state?.body || '',
    blogMainImg: location.state?.image || null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBlogData({
      title: location.state?.title || '',
      body: location.state?.body || '',
      blogMainImg: location.state?.image || null,
    });
  }, [location.state]);

  const handleTitleChange = (e) => setBlogData({ ...blogData, title: e.target.value });
  const handleBodyChange = (e) => setBlogData({ ...blogData, body: e.target.value });

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setBlogData({ ...blogData, blogMainImg: file });
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleChange = (e) => {
    const { name, type, files } = e.target;
    if (type === 'file') {
      setBlogData({ ...blogData, [name]: files[0] });
    }
  };

  const handleUpdate = async () => {
    const { title, body, blogMainImg } = blogData;
    if (!title || !body) {
      setErrorMessage('Title and body are required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      if (blogMainImg instanceof File) {
        formData.append('blogMainImg', blogMainImg);
      }

      const response = await axios.put(`/Brand/updateBlog/${postID}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setBlogData({ title: '', body: '', blogMainImg: null });
        navigate(-1); // Redirect on success
      } else {
        setErrorMessage('Failed to update blog post');
      }
    } catch (error) {
      setErrorMessage('Failed to update blog post');
      console.error('Error updating blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`px-5 sm:w-[600px] mdm:w-[700px] lg:w-[1000px] mx-auto text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] h-screen ${loading ? 'pointer-events-none opacity-50' : ''}`}>
      {loading ? (
        <div className="centered-spinner">
          <div className="spinner"></div>
          <p className="mt-4 text-lg">Updating...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between pt-5">
            <p className="poppins-semibold text-xl">Edit Blog Post</p>
            <div
              className="OrangeButtonWithText-v2 mt-2 xs:mt-0 flex items-center cursor-pointer"
              onClick={handleUpdate}
            >
              <p>Update</p>
            </div>
          </div>

          <div className="flex mt-10 items-center">
            <div className="w-2/3 border-l-2 border-black/40 pl-2">
              <p className="text-2xl text-black/30 ubuntu-medium">Title</p>
              <input
                type="text"
                name="title"
                value={blogData.title}
                onChange={handleTitleChange}
                className="w-full px-2 py-1 mt-2 border border-gray-300 rounded"
                disabled={loading} // Disable during loading
              />
            </div>

            <div
              className="ml-3 h-28 w-28 border-2 rounded-full flex items-center justify-center drag-drop-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {blogData.blogMainImg ? (
                <img
                  src={blogData.blogMainImg instanceof File ? URL.createObjectURL(blogData.blogMainImg) : blogData.blogMainImg}
                  alt="Uploaded"
                  className="h-full w-full object-cover rounded-full border-2 custom-img-border"
                  style={{ borderColor: '#a4a4a4 !important' }}
                />
              ) : (
                <>
                  <p className="poppins-light text-xs text-center">Drag & Drop Photo</p>
                  <input type="file" name="blogMainImg" className="hidden" onChange={handleChange} />
                </>
              )}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xl text-black/30 ubuntu-medium">Tell Your Story</p>
            <textarea
              name="body"
              value={blogData.body}
              onChange={handleBodyChange}
              className="w-full px-2 py-1 mt-2 border border-gray-300 rounded"
              rows="6"
              disabled={loading} // Disable during loading
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 mt-2">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );
};

export default EditBlog;