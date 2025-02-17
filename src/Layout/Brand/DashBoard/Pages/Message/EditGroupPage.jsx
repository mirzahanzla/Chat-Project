import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditGroupPage = () => {
  const [groupTitle, setGroupTitle] = useState('');
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [groupPhotoPreview, setGroupPhotoPreview] = useState(null);
  const [titleError, setTitleError] = useState('');
  const navigate = useNavigate();
  const { groupId } = useParams(); // Get group ID from the route params

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`/api/groups/group/${groupId}`);
        if (response.status === 200) {
          const { title, photo } = response.data;
          setGroupTitle(title);
          setGroupPhotoPreview(photo);
        } else {
          console.error("Failed to fetch group details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setGroupPhoto(file);
      setGroupPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateGroup = async () => {
    if (!groupTitle.trim()) {
      setTitleError('Group title is required.');
      return;
    } else if (groupTitle.length < 8) {
      setTitleError('Group title must be at least 8 characters.');
      return;
    } else {
      setTitleError('');
    }

    try {
      const formData = new FormData();
      formData.append('title', groupTitle);

      if (groupPhoto) {
        formData.append('photo', groupPhoto);
      }

      const response = await axios.put(`/api/groups/group/modify/${groupId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        navigate(-1); // Redirect to the group's detail page or another page
      } else {
        console.error("Error updating group:", response.statusText);
      }
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Navigate back to the group's detail page or a previous page
  };

  return (
    <div className="flex items-top justify-center min-h-screen bg-orange-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
        <h2 className="text-lg font-semibold mb-4 text-orange-600">Edit Group</h2>

        {/* Photo Drop Area */}
        <div
          onDrop={handlePhotoDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex items-center justify-center bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4 relative"
        >
          {groupPhotoPreview ? (
            <img src={groupPhotoPreview} alt="Group Preview" className="rounded-full w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500">Drag & Drop</span>
          )}
        </div>

        {/* Group Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Group Title</label>
          <input
            type="text"
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter Group Title"
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
          />
          {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
        </div>

       {/* Buttons: Update and Cancel */}
       <div className="flex justify-between gap-4">
          <button
            className="bg-orange-600 text-white py-2 px-4 rounded-md w-full hover:bg-orange-700"
            onClick={handleUpdateGroup}
          >
            Update Group
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-md w-full hover:bg-gray-600"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupPage;
