import { useEffect, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import InfluencerProfile from './InfluencerProfile';
import Predict from './predict';

const Search = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(0);
  const [showInfluencerProfile, setShowInfluencerProfile] = useState(0);
  const [influencers, setInfluencers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Added state for search query

  // Function to fetch influencers from the API
  const fetchInfluencers = async (query = '') => {
    const authToken = localStorage.getItem('authToken'); // Get the token from local storage

    try {
      const response = await axios.get('Brand/search', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: { query }, // Send search query (empty initially)
      });
      
      // Set the response data as the influencers
      setInfluencers(response.data.influencers || []);
    } catch (error) {
      console.error('Error fetching influencers:', error);
    }
  };

  // Fetch influencers on component mount
  useEffect(() => {
    fetchInfluencers(); // Fetch influencers without any query
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
  };

  // Handle search button click
  const handleSearchClick = () => {
    fetchInfluencers(searchQuery); // Fetch influencers based on the query
  };

  const handleStatusUpdate = (id, newStatus) => {
    setInfluencers((prevInfluencers) =>
      prevInfluencers.map((influencer) =>
        influencer.id === id ? { ...influencer, status: newStatus } : influencer
      )
    );
  };

  return (
    <>
      {showInfluencerProfile ? (
        <InfluencerProfile 
          setShowInfluencerProfile={setShowInfluencerProfile}
          userName={influencers.find(inf => inf._id === showInfluencerProfile)?.fullName || ''}
        />
      ) : (
        <>
          <AnimatePresence>
            {isFilterOpen && (
              <div className="bg-neutral-300/65 z-20 h-full w-full absolute top-0 right-0">
                <motion.div
                  initial={{ x: 700 }}
                  animate={{ x: 0 }}
                  exit={{ x: 700 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white h-full w-[300px] sm:w-[600px] absolute top-0 right-0"
                >
                  <div className="mx-8 my-5">
                  <div className="hover:cursor-pointer" onClick={() => { setIsFilterOpen(0) }}><img src="/Svg/Close.svg" alt="Close"/></div>
                  <div className="flex justify-between"><div className="justify-center flex text-center py-2 cursor-pointer w-[150px] font-bold poppins-semibold"><p>AI predict </p>
                  </div><div className="flex justify-between"><button className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]">Predict</button></div></div>
                    {/* Add Start here   */}

                    <Predict/>
                    {/* Add Start here   */}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="pt-10">

            {/* Navigation Bar with Predict Button */}
            
            
            <div className="flex justify-center mt-10">
              <div className="flex">
                <div className="md:w-[100px] md:h-[35px] absolute rounded-2xl xs:flex justify-center items-center hidden xs:block">
                  <p className="rouge-script-regular p-1 text-2xl z-20">Instagram</p>
                </div>

                {/* Search bar */}
                <div className="w-[250px] flex justify-center relative xs:w-[350px] sm:w-[400px] pl-2 xs:pl-[90px] rounded-xl md:h-[35px] md:w-[500px] md:pl-[110px] outline-0 text-[9px] xs:text-[10px] sm:text-[13px] md:text-sm bg-white overflow-hidden">
                  <div className="absolute top-3 right-5 cursor-pointer h-full" onClick={handleSearchClick}>
                    <img src="Svg/SearchIcon.svg" alt="" />
                  </div>
                  <input
                    type="text"
                    className="w-full outline-0"
                    placeholder="Search anything here ..."
                    value={searchQuery} // Set value to searchQuery
                    onChange={handleSearchChange} // Handle input change
                  />
                </div>

                {/* Filter button */}
                <div
                  className="border-[2px] border-primary md:w-[100px] md:h-[35px] rounded-2xl flex justify-center items-center ml-1 xs:ml-5 md:ml-5 hover:cursor-pointer hover:bg-primary hover:text-white hover:border-white"
                  onClick={() => setIsFilterOpen(1)}
                >
                  <div className="lato-light p-2 flex justify-between">
                    <p className="hidden xs:block text-[10px] sm:text-[13px] md:text-sm">AI</p>
                    <p className="ml-1 text-[10px] sm:text-[13px] md:text-sm">Predict</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add filters here if needed */} 
            {/* Map over influencers data and display influencer profiles */}
            {influencers.map((influencer) => (
              <ProfileInformation
                key={influencer._id}
                id={influencer._id}
                ProfileImage={influencer.photo}
                name={influencer.fullName}
                UserName={influencer.userName || influencer.fullName}
                Followers={influencer.followers || 0}
                Bio={influencer.Bio || "Influencer has no bio"}
                setShowInfluencerProfile={setShowInfluencerProfile}
                status={influencer.status}
                onStatusUpdate={handleStatusUpdate}
                pic1={influencer.pic1 || "Media/p1.jpg"} // Use static image if pic1 is missing
                pic2={influencer.pic2 || "Media/p6.jpg"} // Use static image if pic2 is missing
                pic3={influencer.pic3 || "Media/p7.jpg"} // Use static image if pic3 is missing
                pic4={influencer.pic4 || "Media/p9.jpg"} // Use static image if pic4 is missing
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

const ProfileInformation = ({ id, ProfileImage, pic1, pic2, pic3, pic4, name,
  UserName, Followers, Bio, setShowInfluencerProfile, status, onStatusUpdate}) => {
  
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(status);

  // Images with default placeholders
  const localPic1 = pic1 || 'Media/p1.jpg';
  const localPic2 = pic2 || 'Media/p6.jpg';
  const localPic3 = pic3 || 'Media/p7.jpg';
  const localPic4 = pic4 || 'Media/p9.jpg';

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const handleAddToNetwork = async () => {
    setIsAdding(true);
    setError(null);

    try {
      await axios.post('Brand/addToNetwork', {
        influencerID: id,
        name: name
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      alert('Influencer added to your network!');
      setCurrentStatus('inNetwork');
      onStatusUpdate(id, 'inNetwork'); // Trigger parent update
    } catch (err) {
      setError('Failed to add influencer to network.');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromNetwork = async () => {
    setIsAdding(true);
    setError(null);

    try {
      await axios.put('Brand/removeFromNetwork', {
        influencerID: id
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      alert('Influencer removed from your network!');
      setCurrentStatus('notInNetwork');
      onStatusUpdate(id, 'notInNetwork'); // Trigger parent update
    } catch (err) {
      setError('Failed to remove influencer from network.');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <div className="mb-10">
      <div className="bg-white OverViewBox2 w-[300px] xs:w-[500px] sm:w-[640px] md:w-[740px] lg:w-[800px] p-2 border-2 mx-auto mt-5 rounded-xl">
        <div className="flex flex-col col-span-3 items-center mt-3">
          <div className="flex size-[60px] xs:size-[80px] sm:size-[100px] md:size-[100px] items-center">
            <img className="aspect-square Avatar" src={`${ProfileImage}`} alt="" />
          </div>
          <p className="poppins-bold text-[9px] xs:text-[10px] sm:text-[13px] md:text-sm mt-4">{name}</p>
          <p className="lato-regular text-[9px] xs:text-[10px] sm:text-[13px] md:text-sm text-black/50">@{UserName}</p>

          <div className="xs:flex mt-4 gap-x-2 justify-center">
              <p
                className='SilverButtonWithText text-[9px] sm:text-[12px] lg:text-sm xs:text-[10px] cursor-pointer'
                onClick={() => setShowInfluencerProfile(id)} // Pass influencer ID
              >
                View Instagram Report
              </p>
              <div 
                className={`OrangeButtonWithText mt-2 xs:mt-0 text-[9px] flex items-center sm:text-[12px] lg:text-sm xs:text-[10px] cursor-pointer ${isAdding ? 'opacity-50' : ''}`} 
                onClick={currentStatus === 'inNetwork' ? handleRemoveFromNetwork : handleAddToNetwork}
                disabled={isAdding}
              >
                {isAdding 
                  ? "Processing..." 
                  : currentStatus === 'inNetwork' 
                    ? "Remove from Network" 
                    : "Add to Network"}
              </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        {/* <div className="col-span-8 sm:col-span-6 ml-5 xs:ml-10 sm:ml-0 flex flex-col xs:border-l-2 sm:border-l-0 lg:border-l-2">
          <div className="sm:mt-10 mr-4">

            <div className="flex items-center justify-around sm:mr-1 md:mr-2">
              <div className="lato-regular">
                <div>
                  <span className="poppins-bold text-[9px] xs:text-[10px] sm:text-[13px] md:text-sm">
                    Influencer Harbor
                  </span>
                  <span className="ml-1 md:text-sm sm:text-[13px] text-[9px] xs:text-[10px]">
                    Followers
                  </span>
                </div>
              </div>
              <div className="lato-regular">
                <div>
                  <span className="poppins-bold text-[9px] sm:text-[13px] md:text-sm xs:text-[10px]">
                    {Followers}
                  </span>
                </div>
              </div>
            </div>

            <div className="poppins-regular text-[9px] sm:text-[13px] md:text-sm mt-5 xs:text-[10px] text-center ml-2">
              <p>{Bio}</p>
            </div>
            <div className="xs:flex mt-4 gap-x-2 justify-center">
              <p
                className='SilverButtonWithText text-[9px] sm:text-[12px] lg:text-sm xs:text-[10px] cursor-pointer'
                onClick={() => setShowInfluencerProfile(id)} // Pass influencer ID
              >
                View Instagram Report
              </p>
              <div 
                className={`OrangeButtonWithText mt-2 xs:mt-0 text-[9px] flex items-center sm:text-[12px] lg:text-sm xs:text-[10px] cursor-pointer ${isAdding ? 'opacity-50' : ''}`} 
                onClick={currentStatus === 'inNetwork' ? handleRemoveFromNetwork : handleAddToNetwork}
                disabled={isAdding}
              >
                {isAdding 
                  ? "Processing..." 
                  : currentStatus === 'inNetwork' 
                    ? "Remove from Network" 
                    : "Add to Network"}
              </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
        </div>
        <div className="hidden sm:block col-span-3 place-content-center">
          <div className="grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden">
            <div className="flex items-center">
              <img className="aspect-square Avatar-v1" src={`${localPic1}`} alt="Pic 1" />
            </div>
            <div className="flex items-center">
              <img className="aspect-square Avatar-v1" src={`${localPic2}`} alt="Pic 2" />
            </div>
            <div className="flex items-center">
              <img className="aspect-square Avatar-v1" src={`${localPic3}`} alt="Pic 3" />
            </div>
            <div className="flex items-center">
              <img className="aspect-square Avatar-v1" src={`${localPic4}`} alt="Pic 4" />
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default Search;