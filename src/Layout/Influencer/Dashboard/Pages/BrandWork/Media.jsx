import React, { useState, useEffect } from 'react';
import DraftUploadModal from './DraftUploadModal';
import ProfileMedia from './ProfileMedia';
import UploadDraft from './UploadDraft';
import EditPost from './EditPost'; // Import the EditPost component
import axios from 'axios';

const Media = ({ status, contractID, totalPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDraftSent, setIsDraftSent] = useState(false); // Track if the draft is sent
  const [editableMedia, setEditableMedia] = useState(null); // Track the media to be edited
  const [isEditPostOpen, setIsEditPostOpen] = useState(false); // Track if the edit post modal is open

  const fetchMediaData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/media?contractID=${contractID}`);
      console.log("Media is: ", response.data);
      setMediaData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching media data:', error);
      setError('Failed to load media data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractID) {
      fetchMediaData();
    }
  }, [contractID]);

  const openModal = (media = null) => {
    setEditableMedia(media); // Set editable media if passed
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditableMedia(null); // Reset editable media on close
  };

  const openEditPost = (media) => {
    console.log("Opening edit post for media: ", media);
    setEditableMedia(media); 
    setIsEditPostOpen(true); 
  };
  
  const closeEditPost = () => {
    console.log("Closing edit post modal");
    setIsEditPostOpen(false);
    setEditableMedia(null);
  };  

  const isUploadDisabled = mediaData.length >= totalPosts;

  // Check if the status allows sending drafts
  const canSendDraft = (status === 'Instructed' || status === 'Draft' || status === 'Accepted') && !isDraftSent;

  // Validate that all required fields in mediaData are filled
  const isAllFieldsFilled = mediaData.every(media => media.imageLink && media.description);

  const handleSendDraft = async () => {
    try {
      const authToken = localStorage.getItem('authToken'); // Retrieve the auth token
      const response = await axios.put(
        `/api/sendDraft/${contractID}`, 
        {},
        { headers: { Authorization: `Bearer ${authToken}` } } // Include the Authorization header
      );

      // Check if the response status is successful (2xx)
      if (response.status >= 200 && response.status < 300) {
        alert('Draft sent successfully!');
        setIsDraftSent(true);  // Disable the send button
        fetchMediaData(); // Optionally refetch media data
      } else {
        alert('Failed to send draft. Please try again.');
      }
    } catch (error) {
      console.error('Error sending draft:', error);
      alert('Failed to send draft: ' + (error.response?.data.message || 'Unknown error'));
    }
  };  

  return (
    <>
      {isEditPostOpen && editableMedia && (
        <EditPost 
          media={editableMedia}
          onClose={closeEditPost}
          onUpdate={fetchMediaData} 
        />
      )}
      <DraftUploadModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        contractID={contractID}
        onMediaUploaded={fetchMediaData}
        editableMedia={editableMedia} // Pass editable media to the modal
      />
      <div className="relative w-full mt-5 pb-10">
        <div className="px-5 flex flex-col">
          <div className="poppins-regular text-[10px] md:text-base">
            <div className="mt-2 grid xs:grid-cols-2   md:grid-cols-4  gap-4 space-x-10">
              <div>
                <UploadDraft 
                  disabled={isUploadDisabled} 
                  onClick={() => openModal()} // Pass the openModal function
                />
              </div>
              {loading ? (
                <p>Loading media...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                mediaData.length === 0 ? (
                  <p>No media available.</p>
                ) : (
                  mediaData.map((media, index) => {
                    const description = media.description.length > 15 
                      ? media.description.slice(0, 15) + '...' 
                      : media.description;

                    const time = new Date(media.createdAt).toLocaleTimeString();

                    return (
                      <ProfileMedia
                        key={index}
                        PostImageSrc={media.imageLink}
                        Type={media.status === 4 ? 'Instructed' : 'Other Status'} // Update this as needed
                        Instruction={media.status}
                        Time={time}
                        Bio={description}
                        onClick={() => {
                          console.log(media); // Log the media object
                          if (media.status === 'Instructed') {
                            openEditPost(media);
                          }
                        }}
                      />
                    );
                  })
                )
              )}
            </div>
          </div>
        </div>
        {/* Render the send button only if there is media data */}
        {mediaData.length === totalPosts && (
          <div className="flex justify-end mt-4">
            <button 
              className={`bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 ${(!canSendDraft || !isAllFieldsFilled) ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ width: '160px' }}  // Adjusting the width for a larger button
              onClick={canSendDraft && isAllFieldsFilled ? handleSendDraft : undefined} // Enable or disable the button
              disabled={!canSendDraft || !isAllFieldsFilled} // Disable if fields are not filled
            >
              {canSendDraft ? 'Send' : 'Sent'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Media;