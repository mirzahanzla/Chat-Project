import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileMedia from "../../../../../Components/Card/ProfileMedia";
import './Index.css';

const Media = () => {
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noMediaMessage, setNoMediaMessage] = useState('');

  useEffect(() => {
    const fetchMediaData = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError('Authorization token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/instaMedia', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        console.log('API response data:', response.data);

        // Check if 'data' key exists and is an array
        if (response.data && Array.isArray(response.data.data)) {
          const data = response.data.data.map(media => {
            return {
              instaPostID: media.PostImageID, // Using PostImageID
              PostImageSrc: media.PostImageSrc, // Using PostImageSrc
              ProfileImage: media.ProfileImage,
              name: media.name,
              Likes: media.Likes,
              Comments: media.Comments
            };
          });

          setMediaData(data);
          setNoMediaMessage(''); // Clear no media message if data is present
        } else if (response.data.message) {
          setNoMediaMessage("Nothing to show right now!");
          setMediaData([]);
        } else {
          setError('Unexpected response format.');
        }
      } catch (error) {
        console.error('Error fetching media data:', error);
        setError('Failed to fetch media data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white w-full mt-10 rounded-3xl mb-10" id='Media'>
      <div className="px-5 py-5 flex flex-col">
        <p className="lato-bold text-lg">Media</p>
        <div className="mt-6 poppins-regular text-[10px] md:text-base">
          {noMediaMessage ? (
            <p>{noMediaMessage}</p>
          ) : (
            <div className="mt-2 grid xs:grid-cols-2  md:grid-cols-3  gap-y-5">
              {mediaData.map((media, index) => (
                <ProfileMedia
                  key={index}
                  instaPostsrc={media.PostImageSrc} // Using PostImageID for the prop
                  src={media.PostImageSrc} // Adding src for the post image
                  ProfileImage={media.ProfileImage}
                  name={media.name}
                  Likes={media.Likes}
                  Comments={media.Comments}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Media;