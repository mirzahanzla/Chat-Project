import React, { useState, useEffect } from 'react';
import NavBarItems from './NavBarItems';
import axios from 'axios';

const DraftUploadModal = ({ isOpen, onClose, contractID, onMediaUploaded }) => {
  const navItems = ['Post', 'Video'];
  const [dragging, setDragging] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null); // To hold the file for upload
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error state

  const [User,setUser]=useState(0)

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
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? '' : 'hidden'} z-30`}>
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <div className="flex justify-end mr-4 h-[20px] cursor-pointer" onClick={onClose}>
          <img src="/Svg/Close.svg" alt="Close" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Upload a draft for review</h2>
        <p className="text-gray-600 mb-6">
          The organizer will then be notified about your submitted draft. Do not make a post before receiving approval.
        </p>
        <div className="flex w-[200px] sm:w-[300px] mx-auto sm:ml-10 mb-5">
          <NavBarItems items={navItems}  setUser={setUser}/>
        </div>


      {User===0?( <><div
          className={`border-dashed border-2 border-gray-300 rounded-lg h-32 flex items-center justify-center mb-4 text-gray-400 text-center flex-col ${dragging ? 'bg-gray-100' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()} // Trigger file input on click
        >
          {mediaPreview ? (
            mediaPreview.type === 'image' ? (
              <img src={mediaPreview.src} alt="Preview" className="h-full w-full object-cover rounded-lg" />
            ) : (
              <video controls className="h-full w-full object-cover rounded-lg">
                <source src={mediaPreview.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <>
              <p>+</p>
              <p>Upload Content<br />Supported format: .jpg, .mp4</p>
            </>
          )}
          {/* Hidden file input for browsing */}
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            accept="image/*,video/*"
            onChange={handleFileBrowse}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="w-full border rounded-lg p-2"
            rows="4"
            placeholder="Add post text here..."
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end">
          <button 
            onClick={handleSubmit} 
            className={`bg-orange-500 text-white px-6 py-2 rounded-full focus:outline-none hover:bg-orange-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
</>
      ):  <label className="block text-gray-700 mb-2 text-lg text-center poppins-light mt-5" htmlFor="description">Coming Soon !</label>}
      </div>
    </div>
  );
};

export default DraftUploadModal;