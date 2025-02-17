import React, { useState, useEffect } from 'react';
import NavBarItems from '../../../../Influencer/Dashboard/Pages/BrandWork/NavBarItems';
import axios from 'axios';

const PostModal = ({ isOpen, onClose, contractID, onMediaUploaded, setShowPosts, posts, handleApprove, setSelectedPostId, setErrorMessage }) => {
  const navItems = ['Post', 'Video'];
  const [dragging, setDragging] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null); // To hold the file for upload
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error state

  const [User, setUser] = useState(0)

  useEffect(() => {
    return () => {
      if (mediaPreview && mediaPreview.src) {
        URL.revokeObjectURL(mediaPreview.src);
      }
    };
  }, [mediaPreview]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image') && !file.type.startsWith('video')) {
        alert('Unsupported file type. Please upload an image or video.');
        return;
      }
      const fileURL = URL.createObjectURL(file);
      setMediaPreview({ type: file.type.startsWith('image') ? 'image' : 'video', src: fileURL });
      setMediaFile(file); // Set the file for upload
    }
  };

  const handleFileBrowse = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    if (!mediaFile) {
      alert('Please upload a media file.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('contractID', contractID);
    formData.append('media', mediaFile);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (onMediaUploaded) {
        onMediaUploaded(response.data);
      }

      setMediaPreview(null);
      setMediaFile(null);
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Upload error:', error.message);
      setError('Failed to upload media. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>



      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50  z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full " >

          <div className="flex justify-end mr-4 h-[20px] cursor-pointer" onClick={() => setShowPosts(false)}>
            <img src="/Svg/Close.svg" alt="Close" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Upload a draft for review</h2>
          {/* <p className="text-gray-600 mb-6">
            The organizer will then be notified about your submitted draft. Do not make a post before receiving approval.
          </p> */}

        

          <div className="grid grid-cols-1 gap-4">
            {posts.length > 0 ? (
              posts.slice(0, 5).map(post => (
                <div key={post._id} className="flex flex-col   p-2">
                  <img src={post.imageLink} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                  <div className='leading-[1px] mt-5'>
                    <p className='flex justify-start'>Description </p>
                    <p className="text-sm p-2 border w-full flex justify-start mt-5 rounded-lg text-gray-600 mb-6">{post.description}</p>
                  </div>
                  <div className="flex   justify-end gap-x-5 ">

                    <div
                      className="bg-primary hover:bg-white hover:text-primary rounded-lg text-white justify-center flex text-center cursor-pointer w-[110px] items-center leading-[1px] py-5"
                      onClick={() => handleApprove(post._id)}>
                      <p>Approve</p>
                    </div>
                    <div
                      className="border-primary border-[1px] text-primary hover:bg-white hover:text-primary rounded-lg justify-center flex text-center cursor-pointer w-[110px] items-center"
                      onClick={() => {
                        setSelectedPostId(post._id);
                        setErrorMessage(''); // Clear previous error message
                      }}>
                      <p>  Instruct</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default PostModal;