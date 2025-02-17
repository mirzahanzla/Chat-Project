import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBarItems from './NavBarItems';

const EditPost = ({ media, onClose, onUpdate }) => {
  const navItems = ['Post', 'Video'];
  const [dragging, setDragging] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null); // To hold the file for upload
  const [description, setDescription] = useState(media.description);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error state

  console.log("Media : ", media);

  useEffect(() => {
    if (media.imageLink) {
      setMediaPreview({ type: media.imageLink.endsWith('.mp4') ? 'video' : 'image', src: media.imageLink });
    }
    return () => {
      if (mediaPreview && mediaPreview.src) {
        URL.revokeObjectURL(mediaPreview.src);
      }
    };
  }, [media]);

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
      setDescription(media.description); // Reset description if needed
    }
  };

  const handleFileBrowse = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpdate = async () => {
    if (media.status !== 'Instructed') {
        setError('You can only edit posts with the status "Instructed".');
        return; // Prevent further execution if status is not "Instructed"
    }
  
    const formData = new FormData();
    formData.append('description', description);
    formData.append('mediaID', media.id || media._id); // Ensure media.id or media._id is correct
  
    // Log the formData for debugging
    console.log('FormData before sending:', {
        description: description,
        mediaID: media.id || media._id, // Log the correct media ID
        mediaFile: mediaFile ? mediaFile.name : 'No file', // Check if file is present
    });
  
    if (!media.id && !media._id) {
        setError('Media ID is required.');
        return; // Prevent further execution if media ID is not present
    }
  
    if (mediaFile) {
        formData.append('media', mediaFile); // Add the new media file if it exists
    }
  
    setLoading(true);
    setError(null);
  
    try {
        const response = await axios.put('/api/editMedia', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
  
        if (response.status === 200) {
            onUpdate(); // Call the parent update function to refresh the media
            onClose(); // Close the edit modal
        } else {
            setError('Failed to update post.');
        }
    } catch (err) {
        setError('Error updating post: ' + (err.response?.data.message || 'Unknown error'));
    } finally {
        setLoading(false);
    }
 };  

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-30`}>
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <div className="flex justify-end mr-4 h-[20px] cursor-pointer" onClick={onClose}>
          <img src="/Svg/Close.svg" alt="Close" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex w-[200px] sm:w-[300px] mx-auto sm:ml-10 mb-5">
          <NavBarItems items={navItems} />
        </div>
        <div
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
            <p>Upload Content<br />Supported format: .jpg, .mp4</p>
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
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className={`bg-orange-500 text-white px-6 py-2 rounded-full focus:outline-none hover:bg-orange-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;