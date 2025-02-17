import { useState, useEffect, useContext } from 'react';
import { CampaignContext } from './CurrentCompaign';

const Content = () => {
  const campaignData = useContext(CampaignContext);
  console.log('Campaign Data in Content: ', campaignData);

  // Only render Media if campaignData._id exists
  return (
    <>
      {campaignData?._id ? (
        <Media dealID={campaignData._id} />
      ) : (
        <p>Loading campaign data...</p>
      )}
    </>
  );
}

const Media = ({ dealID }) => {
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    if (!dealID) {
      console.error('No dealID provided');
      return;
    }

    // Fetch media data from API using dealID
    const fetchMediaData = async () => {
      try {
        const response = await fetch(`/Brand/getInstaMediaByDealID/${dealID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch media data');
        }
        const result = await response.json();
        setMediaData(result.instaMedia); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching media data:', error);
      }
    };

    fetchMediaData();
  }, [dealID]); // Re-fetch data when dealID changes

  return (
    <div className="bg-white rounded-3xl mb-10 w-[290px] xs:w-[400px] sm:w-[600px] mdm:w-[800px] lg:w-[900px] mx-auto mt-5">
      <div className="px-5 py-5 flex flex-col">
        <div className="flex justify-between">
          <p className="lato-bold text-lg">Media</p>
        </div>

        <div className="mt-2 grid xs:grid-cols-2 sm:grid-cols-1 gap-4 sm:grid-cols-2 mdm:grid-cols-4 lg:grid-cols-5">
          {mediaData.map((media, index) => (
            <ProfileMedia
              key={index}
              PostImageSrc={media.postImageSrc}
              ProfileImage={media.influencerPhoto} 
              name={media.influencerName}
              Likes={media.likes}
              Comments={media.comments}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const ProfileMedia = ({ PostImageSrc, ProfileImage, name, Likes, Comments }) => {
  return (
    <>
      <div className="text-[10px] lg:text-[12px] sm:w-[250px] sm:h-[370px] mdm:w-[150px] mdm:h-[250px] bg-white rounded-2xl flex flex-col OverViewBox1 justify-self-center">
        <div className="w-[150px] rounded-xl overflow-hidden">
          <div className="h-[190px] rounded-lg flex items-center">
            <img className="aspect-square ProfileMedia" src={PostImageSrc} alt="" />
          </div>

          <div className="mt-3 ml-3 flex items-center">
            <img src={ProfileImage} className="Avatar size-[25px]" alt="" />

            <div className="ml-2 flex justify-center flex-col text-[10px]">
              <p className="font-bold">{name}</p>
              <div className="flex gap-x-3 text-[10px]">
                <p className="flex items-center gap-x-1">
                  <img src="/Svg/Heart.svg" className="Avatar size-[10px]" alt="" />
                  <p>{Likes}</p>
                </p>
                <p className="flex items-center gap-x-1">
                  <img src="/Svg/Comment.svg" className="Avatar size-[10px]" alt="" />
                  <p>{Comments}</p>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Content;