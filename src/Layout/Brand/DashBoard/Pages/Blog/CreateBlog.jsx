import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {

  const [blogData, setBlogData] = useState({
    title: '',
    body: '',
    blogMainImg: null
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleTitleChange = (e) => setBlogData({ ...blogData, title: e.target.value });
  const handleBodyChange = (e) => setBlogData({ ...blogData, body: e.target.value });



  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setBlogData({ ...blogData, blogMainImg: files[0] });
    } else if (type === 'select-multiple') {
      setBlogData({ ...blogData, blogMainImg: Array.from(e.target.selectedOptions, option => option.value) });
    } else {
      setBlogData({ ...blogData, blogMainImg: value });
    }
    console.log(blogData)
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };



  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setBlogData({ ...blogData, blogMainImg: file });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setBlogData({ ...blogData, ["blogMainImg"]: files[0] });
    } else if (type === 'select-multiple') {
      setBlogData({ ...blogData, ["blogMainImg"]: Array.from(e.target.selectedOptions, option => option.value) });
    } else {
      setBlogData({ ...blogData, [name]: value });
    }
    console.log(blogData)
  };

  const handlePublish = async () => {
    const { title, body, blogMainImg } = blogData;
    console.log(blogData)
    // Validation checks
    if (!title || !body) {
      setErrorMessage('Title and body are required');
      return;
    }
  
    if (title.length < 15 || title.length > 50) {
      setErrorMessage('Title must be between 15 and 50 characters');
      return;
    }
  console.log(body.length)
    if (body.length < 300 || body.length > 1000) {
      setErrorMessage('Body must be between 300 and 1000 characters');
      return;
    }
  
    if (!blogMainImg) {
      setErrorMessage('Please upload an image for the blog post');
      return;
    }
  
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
  
      // Only append the image if it's not empty
      if (blogMainImg) {
        formData.append('blogMainImg', blogMainImg);
      }
  
      const response = await axios.post('/Brand/addBlog', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 201) {
        setBlogData({ title: '', body: '', blogMainImg: null });
        navigate(-1); // Redirect on success
      } else if (response.status === 500 && response.data.message.includes('blog post was removed')) {
        setBlogData({ title: '', body: '', blogMainImg: null });
        setErrorMessage('Failed to update user blog count, the blog post was removed.');
      } else {
        setBlogData({ title: '', body: '', blogMainImg: null });
        setErrorMessage('Failed to create blog post');
      }
    } catch (error) {
      setBlogData({ title: '', body: '', blogMainImg: null });
      setErrorMessage('Failed to create blog post');
      console.error('Error creating blog post:', error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className={`px-5 sm:w-[600px] mdm:w-[700px] lg:w-[1000px] mx-auto text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] h-screen ${loading ? 'pointer-events-none opacity-50' : ''}`}>
      <div className="flex justify-between pt-5">
        <p className="poppins-semibold text-xl">Blog Posts</p>
        <div
          className="OrangeButtonWithText-v2 mt-2 xs:mt-0 flex items-center cursor-pointer"
          onClick={!loading ? handlePublish : null}
        >
          <p>{loading ? 'Publishing...' : 'Publish'}</p>
        </div>
      </div>

      <div className="flex mt-10 items-center">
        <div className="w-2/3 border-l-2 border-black/40 pl-2">
          <input
            type="text"
            name="title"
            value={blogData.title}
            onChange={handleTitleChange}
            placeholder="Enter blog title..."
            className="w-full px-2 py-1 mt-2 bg-[#E7E8EC] rounded  text-2xl outline-0 text-black ubuntu-medium"
            disabled={loading} // Disable during loading
          />
        </div>

        <div
          className="ml-3 h-28 w-28 border-2 rounded-full flex items-center justify-center drag-drop-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {blogData.blogMainImg ? (
            <img src={URL.createObjectURL(blogData.blogMainImg)}
            alt="Uploaded" 
            className="h-full w-full object-cover rounded-full border-2 custom-img-border" 
            style={{ borderColor: '#a4a4a4 !important' }}
            disabled={loading}/>
          ) : (
            <>
              {/* <p className="poppins-light text-xs text-center">Drag & Drop Photo</p>
              <input type="file" name="blogMainImg" className="hidden" onChange={handleChange} /> */}
                  <div
      className={`h-20 w-20 mx-auto p-1 sm:h-28 sm:w-28 rounded-full flex flex-col items-center justify-center cursor-pointer ${image ? '' : 'border-2'} z-20 border-4 border-red-50`}
      onClick={handleDivClick}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <div className={`flex justify-center ${!image ? "w-[50px]" : "w-[100px]"}`}>
        <img
          src={image || '/Svg/Upload.svg'}
          alt="Upload"
          className={`${!image ? "w-[25px] h-[25px]" : "w-[100px] h-[100px]"} Avatar rounded-full`}
        />
      </div>
      {!image && <p className="poppins-light">Upload Photo</p>}
    </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8">
        <textarea
          name="body"
          value={blogData.body}
          onChange={handleBodyChange}
          placeholder="Enter blog content..."
          className="w-full px-2 py-1 mt-2  rounded text-xl text-black ubuntu-medium bg-[#E7E8EC] outline-0"
          rows="6"
          disabled={loading} // Disable during loading
        />
      </div>

      {errorMessage && (
        <p className="text-red-500 mt-2">{errorMessage}</p>
      )}
    </div>
  );
};


const PhotoUpload = ({ onImageChange }) => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      onImageChange(file); // Pass the File object to the parent component
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`h-20 w-20 mx-auto p-1 sm:h-28 sm:w-28 rounded-full flex flex-col items-center justify-center cursor-pointer ${image ? '' : 'border-2'} z-20`}
      onClick={handleDivClick}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <div className={`flex justify-center ${!image ? "w-[50px]" : "w-[100px]"}`}>
        <img
          src={image || '/Svg/Upload.svg'}
          alt="Upload"
          className={`${!image ? "w-[25px] h-[25px]" : "w-[100px] h-[100px]"} Avatar rounded-full`}
        />
      </div>
      {!image && <p className="poppins-light">Upload Photo</p>}
    </div>
  );
};

export default CreateBlog;