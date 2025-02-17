
import { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure Axios is installed
import { AnimatePresence, motion } from 'framer-motion';
import InfluencerProfile from './InfluencerProfile';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center mt-5">
    <div
      style={{
        border: '4px solid #f3f3f3',
        borderRadius: '50%',
        borderTop: '4px solid #3498db',
        width: '30px',
        height: '30px',
        animation: 'spin 2s linear infinite',
      }}
    ></div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);


const Search = () => {
  const [IsFilterOpen, setIsFilterOpen] = useState(0);
  const [ShowInfluencerProfile, setShowInfluencerProfile] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If the query is empty, reset everything
      setSearchResults([]);
      setErrorMessage('');
      setIsLoading(false);
      return;
    }
  
    // Debounce search functionality (2 seconds)
    if (debounceTimeout) clearTimeout(debounceTimeout);
  
    const timeout = setTimeout(() => {
      handleSearch();
    }, 2000);
  
    setDebounceTimeout(timeout);
  
    return () => clearTimeout(timeout);
  }, [searchQuery]);
  
  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
  
    setIsLoading(true); // Show loading spinner
    setErrorMessage('');
    setSearchResults([]);
  
    try {
      const response = await axios.get(`/api/users/search`, {
        params: { query: searchQuery },
        cancelToken: new axios.CancelToken((c) => (window.cancelRequest = c)),
      });
  
      setTimeout(() => {
        if (response.data.length === 0) {
          setErrorMessage('User not found');
        } else {
          setSearchResults(response.data);
        }
        setIsLoading(false); 
      }, 5000); 
    } catch (error) {
      setTimeout(() => {
        if (error.response && error.response.status === 404) {
          setErrorMessage('User not found'); // Handle 404 Not Found error
        } else {
          setErrorMessage('An error occurred while searching. Please try again.');
        }
        setIsLoading(false); // Hide the spinner
      }, 5000); // Wait for 5 seconds even on error
    }
  };
  

  return (
    <>
      {ShowInfluencerProfile ? (
        <InfluencerProfile setShowInfluencerProfile={setShowInfluencerProfile} />
      ) : (
        <>
          <AnimatePresence>
            {IsFilterOpen && (
              <div className="bg-neutral-300/65 z-20 h-full w-full absolute top-0 right-0">
                <motion.div
                  initial={{ x: 700 }}
                  animate={{ x: 0 }}
                  exit={{ x: 700 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white h-full w-[300px] sm:w-[600px] absolute top-0 right-0"
                >
                  <div className="mx-8 my-5">
                    <div className="hover:cursor-pointer" onClick={() => setIsFilterOpen(false)}>
                      <img src="Svg/Close.svg" alt="Close" />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="pt-10">
            <p className="lato-bold md:text-xl text-center">
              Search from the World{' '}
              <span style={{ color: '#FB773F' }} className="defaultTextColor">
                Largest Database{' '}
              </span>
              of Influencers
            </p>

            {/* Search Bar */}
            <div className="flex justify-center mt-10">
              <div className="flex">
                <div className="md:w-[100px] md:h-[35px] absolute rounded-2xl xs:flex justify-center items-center hidden xs:block">
                  <p className="rouge-script-regular p-1 text-2xl z-20">Instagram</p>
                </div>

                <div className="w-[250px] flex justify-center relative xs:w-[350px] sm:w-[400px] pl-2 xs:pl-[90px] rounded-xl md:h-[35px] md:w-[500px] md:pl-[110px] outline-0 text-[9px] xs:text-[10px] sm:text-[13px] md:text-sm bg-white overflow-hidden">
                  <input
                    type="text"
                    className="w-full outline-0"
                    placeholder="Search anything here ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute top-3 right-5 cursor-pointer h-full">
                    <img src="Svg/SearchIcon.svg" alt="Search" />
                  </div>
                </div>
              </div>
            </div>

            {/* Display Error Message */}
            {errorMessage && (
              <p className="text-center text-red-500 mt-4">{errorMessage}</p>
            )}

            {/* Loading Spinner */}
            {isLoading && <LoadingSpinner />}

            {/* Search Results */}
            <div className="mt-5">
            {
  searchResults.length > 0 ? (
    searchResults.map((result, index) => (
      <ProfileInformation
        key={index}
        ProfileImage={result.photo || "Media/default_profile.jpg"} // Fallback profile image
        name={result.fullName || "Unknown Name"}
        UserName={result.userName || "Unknown Username"}
        Followers={result.followers || 0}
        ER={result.Engagement || 0} // Default to 0 if engagement rate is missing
        Instagram={result.Instagram || "N/A"} // Default to N/A if Instagram link is missing
        Likes={result.Likes || 0} // Default to 0 if likes are missing
        Comments={result.Comments || 0} // Default to 0 if comments are missing
        Bio={result.Bio || "Bio not available"} // Default message if Bio is missing
        pic1={result.pic1 || "Media/p1.jpg"} // Use static image if pic1 is missing
        pic2={result.pic2 || "Media/p6.jpg"} // Use static image if pic2 is missing
        pic3={result.pic3 || "Media/p7.jpg"} // Use static image if pic3 is missing
        pic4={result.pic4 || "Media/p9.jpg"} // Use static image if pic4 is missing
        setShowInfluencerProfile={setShowInfluencerProfile}
      />
    ))
  ) : (
    !isLoading && <p className="text-center">No results found.</p>
  )
}
            </div>
          </div>
        </>
      )}
    </>
  );
};


const ProfileInformation = ({ 
  ProfileImage, 
  name, // Full name or username
  UserName, 
  Followers, 
  ER, 
  Instagram, 
  Likes, 
  Comments, 
  Bio, 
  pic1, 
  pic2, 
  pic3, 
  pic4, 
  userId // The logged-in user's ID
}) => {
  
  const [isFollowing, setIsFollowing] = useState(false); // Initial state for follow/unfollow
  const [followers, setFollowers] = useState(Followers); // Store followers count locally

  // Local image paths with defaults
  const localPic1 = pic1 || 'Media/p1.jpg';
  const localPic2 = pic2 || 'Media/p6.jpg';
  const localPic3 = pic3 || 'Media/p7.jpg';
  const localPic4 = pic4 || 'Media/p9.jpg';

  useEffect(() => {
    // Simulate fetching the initial follow status from a local variable
    // In a real case, you might check against stored user data
    const checkUserStatus = () => {
      const initialStatus = false; // Simulate not following initially
      setIsFollowing(initialStatus);
    };

    checkUserStatus();
  }, [name]);

  const handleFollowClick = () => {
    try {
      if (isFollowing) {
        // Simulate unfollowing the user
        console.log(`${userId} unfollowed ${name}`);
        setIsFollowing(false);
        setFollowers(prevFollowers => prevFollowers - 1); // Decrease followers count
      } else {
        // Simulate following the user
        console.log(`${userId} followed ${name}`);
        setIsFollowing(true);
        setFollowers(prevFollowers => prevFollowers + 1); // Increase followers count
      }
    } catch (error) {
      console.error("Error toggling follow/unfollow", error);
    }
  };

  return (
    <div className="mb-10">
      <div className="bg-white OverViewBox2 xs:grid grid-cols-12 w-[300px] xs:w-[500px] sm:w-[640px] md:w-[740px] lg:w-[800px] p-2 border-2 mx-auto mt-5 rounded-xl">
        {/* Left side of profile */}
        <div className="flex flex-col col-span-3 items-center mt-3">
          <div className="flex size-[60px] xs:size-[80px] sm:size-[100px] md:size-[100px] items-center">
            <img className="aspect-square Avatar" src={`${ProfileImage}`} alt={name} />
          </div>
          <p className="poppins-bold text-[9px] xs:text-[10px] sm:text-[13px] md:text-sm mt-4">{name}</p>
          <p className="lato-regular text-[9px] xs:text-[10px] sm:text-[13px] md:text-sm text-black/50">{UserName}</p>
        </div>

        {/* Middle of profile */}
        <div className="col-span-8 sm:col-span-6 ml-5 xs:ml-10 sm:ml-0 flex flex-col xs:border-l-2 sm:border-l-0 lg:border-l-2">
          <div className="sm:mt-10 mr-4">
            <div className="flex items-center justify-around sm:mr-1 md:mr-2">
              <div className="lato-regular">
                <div>
                  <span className="poppins-bold text-[9px] xs:text-[10px] sm:text-[13px] md:text-sm">{followers}</span>
                  <span className="ml-1 md:text-sm sm:text-[13px] text-[9px] xs:text-[10px]">Followers</span>
                </div>
                <div className="flex items-center sm:mt-1 md:mt-2">
                  <img className="h-[12px] xs:h-[15px] sm:h-[20px] mr-2" src="Svg/Instagram.svg" alt="Instagram" />
                  <p className="lato-light text-[9px] xs:text-[10px] sm:text-base">{Instagram}</p>
                </div>
              </div>
              <div className="lato-regular">
                <div>
                  <span className="poppins-bold text-[9px] sm:text-[13px] md:text-sm xs:text-[10px]">{ER}</span>
                  <span className="ml-1 md:text-sm sm:text-[13px] xs:text-[10px] text-[9px]">Engagement Rate</span>
                </div>
                <div className="flex justify-center gap-x-3 mt-2">
                  <div className="flex items-center gap-x-1">
                    <img src="/Svg/Heart.svg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="Likes" />
                    <p className="text-[9px] lato-light xs:text-[10px] sm:text-sm">{Likes}</p>
                  </div>
                  <div className="flex items-center gap-x-1">
                    <img src="/Svg/Comment.svg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="Comments" />
                    <p className="text-[9px] lato-light xs:text-[10px] sm:text-sm">{Comments}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="poppins-regular text-[9px] sm:text-[13px] md:text-sm mt-5 xs:text-[10px] text-center ml-2">
              <p>{Bio}</p>
            </div>

            {/* Actions: View Report and Follow/Unfollow */}
            <div className="xs:flex mt-4 gap-x-2 justify-center">
              {/* <p className='SilverButtonWithText text-[9px] sm:text-[12px] lg:text-sm xs:text-[10px] cursor-pointer' onClick={() => {
                setShowInfluencerProfile(1);
              }}>View Report</p> */}
              
              <div 
                className={`OrangeButtonWithText mt-2 xs:mt-0 text-[9px] flex items-center sm:text-[12px] lg:text-sm xs:text-[10px] cursor-pointer ${isFollowing ? 'bg-red-500' : 'bg-green-500'}`} 
                onClick={handleFollowClick}
              >
                <p>{isFollowing ? 'Unfollow' : 'Follow'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side of Profile: Influencer Pictures */}
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
        </div>
      </div>
    </div>
  );
};


export default Search;
