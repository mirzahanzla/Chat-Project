import { useState, useEffect, useRef } from 'react';
import { motion, MotionConfig } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserIssue from './UserIssuePage/UserIssue';
import UserPayment from './UserIssuePage/UserPayment';
import UserSetting from './UserIssuePage/UserSetting';
import InfluencerProfile2 from './UserIssuePage/InfluencerProfile2';
import Report from './UserIssuePage/REport';
import BrandProfile from './UserIssuePage/Brand/BrandProfile';
import BrandSetting from './UserIssuePage/Brand/BrandSetting';
import AuidenceProfile from './UserIssuePage/Auidence/AuidenceProfile';
import AuidenceSetting from './UserIssuePage/Auidence/AuidenceSetting';


const TopHeader = ({ SideBar, setSideBar, Pages, activeButton }) => {
  // Removing the / from the Pages to display the Correct Name

  const PageName = Pages.map(path => path.substring(1));


  // If sidebar is open, change the color
  const HandBurger = `h-1 rounded-full w-[30px] my-1 ${SideBar ? 'bg-white' : 'bg-black'}`;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [Notification, setNotification] = useState(false);
  const dropdownRef = useRef(null);
  // const navigate = useNavigate(); // Use navigate for redirection
  const [user, setUser] = useState(null); // State to store user data
  const [userIssue, setUserIssue] = useState(false); // State to store user data
  const [userPayment, setUserPayment] = useState(false); // State to store user data
  const [userSetting, setUserSetting] = useState(false); // State to store user data
  const [InfluencerProfile, setInfluencerProfile] = useState(false); // State to store user data
  const [ReportState, setReport] = useState(false); // State to store user data

  const influencerCookie = Cookies.get('U');
  console.log("influcer cookie is")
  console.log(influencerCookie)
  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/user/getProfileData', { // Use your provided API endpoint
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data); // Store the user data in state
      } catch (error) {
        console.error(error); // Handle error as needed
      }
    };
    if (influencerCookie !== 'C') {
      fetchUserData(); // Call the function to fetch user data
    }

  }, []); // Empty dependency array to run only once on mount

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setNotification(false)
  };

  const handleLogout = () => {
    // Clear the cookie
    Cookies.remove('yourCookieName'); // Replace with your actual cookie name
    // Redirect to login
    window.location.href = '/Login';
    // Close the dropdown menu
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    // setIsDropdownOpen(false); // Close the dropdown
    // navigate('/profile', { state: { user } }); // Pass user data in state
    setInfluencerProfile(true)
  };


  const handleSettingsClick = () => {
    // setIsDropdownOpen(false); // Close the dropdown
    // navigate('/Settings'); // Pass user data in state
    setUserSetting(true)
  };
  const handlePaymentClick = () => {
    setUserPayment(true)
  };



  const handleHelpClick = () => {
    // setIsDropdownOpen(false); // Close the dropdown
    setUserIssue(true)
  };

  const handleReportClick = () => {
    // setIsDropdownOpen(false); // Close the dropdown
    setReport(true)
  };
  return (
    <>
      <div className='z-20'>
        <div className='w-full h-[60px] bg-white flex items-center'> {/* Dashboard Top Heading */}
          <div className='poppins-semibold mx-10 flex justify-between w-full rounded-full items-center '>
            <div className='flex items-center'>
              <MotionConfig transition={{ duration: 0.5 }}>
                <div
                  className={`md:hidden mr-4 z-20 ${SideBar ? 'text-black' : 'text-white'}`}
                  onClick={() => setSideBar(!SideBar)}
                >
                  {/* Hamburger Three lines and their animation */}
                  <motion.div
                    style={{ transformOrigin: "left center" }}
                    animate={SideBar ? { rotate: 45, transformOrigin: "left center", x: "-2px" } : ""}
                    className={HandBurger}
                  />
                  <motion.div
                    animate={SideBar ? { x: -100, opacity: 0 } : { x: 0, opacity: 1 }}
                    className={HandBurger}
                  />
                  <motion.div
                    style={{ transformOrigin: "right center" }}
                    animate={SideBar ? { rotate: -45, transformOrigin: "right center", x: "-11px", y: -17 } : ''}
                    className={HandBurger}
                  />
                </div>
              </MotionConfig>
              {/* Header Name is displayed here */}
              <p>{PageName[activeButton]}</p>
            </div>
            {/* Profile picture and Notification Icon are displayed here */}
            <div className='relative'>
        
            { (influencerCookie !== 'C')&&      <div className='flex justify-between w-[100px]' >
                <img src="/Svg/Notification.svg" alt="Notification" onClick={() => {  setNotification(true) ;setIsDropdownOpen(false) }} />
                <img className='w-[45px] h-[45px] Avatar rounded-full' src={user?.photo} alt="Avatar" onClick={toggleDropdown} />
              </div>
}
              {/* Dropdown for profile options */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  id="dropdownDivider"
                  className="z-20 absolute right-0 bg-white divide-y divide-orange-100 rounded-lg shadow w-44 text-black dark:divide-orange-600 border-2 border-[#FB773F] text-[12px] mt-2"
                >
                  <ul className="py-2 text-black" aria-labelledby="dropdownDividerButton">
                    {(influencerCookie === 'C') && <li>
                      <a href="#" className="block px-4 py-2 hover:bg-orange-100" onClick={handleReportClick}>Report</a>
                    </li>}
                    {(influencerCookie !== 'C') && <li>
                      <a href="#" className="block px-4 py-2 hover:bg-orange-100" onClick={handleProfileClick}>
                        Profile
                      </a>
                    </li>}
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-orange-100" onClick={handleSettingsClick}>Settings</a>
                    </li>
                    {(influencerCookie === 'influencer') && <li>
                      <a href="#" className="block px-4 py-2 hover:bg-orange-100" onClick={handlePaymentClick}>Payment</a>
                    </li>}

                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-orange-100" onClick={handleHelpClick}>Help</a>
                    </li>
                  </ul>
                  <div className="py-2">
                    <a
                      className="block px-4 py-2 hover:bg-orange-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </a>
                  </div>
                </div>
              )}
              {Notification && (
                <div
                  ref={dropdownRef}
                  id="dropdownDivider"
                  className="z-20 absolute -right-10 bg-white divide-y divide-orange-100 rounded-lg shadow  text-black dark:divide-orange-600 border-2 border-[#FB773F] text-[12px] mt-2 p-2 w-[300px]"
                >
                  Add Notification
               
                </div>
              )}




            </div>
          </div>
        </div>

        {userIssue && <UserIssue onCloseIssue={setUserIssue} />}

        {/*Brand List  */}
        {InfluencerProfile && ((influencerCookie === 'Brand') || (influencerCookie === 'brand')) && <BrandProfile onCloseIssue={setInfluencerProfile} user={user} />}
        {userSetting && ((influencerCookie === 'Brand') || (influencerCookie === 'brand')) && <BrandSetting onCloseIssue={setUserSetting} />}


        {/*Influncer List  */}
        {InfluencerProfile && (influencerCookie === 'influencer') && <InfluencerProfile2 onCloseIssue={setInfluencerProfile} user={user} />}
        {userSetting && (influencerCookie === 'influencer') && <UserSetting onCloseIssue={setUserSetting} />}
        {userPayment && (influencerCookie === 'influencer') && <UserPayment onCloseIssue={setUserPayment} />}

        {/*User List  */}
        {InfluencerProfile && (influencerCookie === 'User') && <AuidenceProfile onCloseIssue={setInfluencerProfile} user={user} />}
        {userSetting && (influencerCookie === 'User') && <AuidenceSetting onCloseIssue={setUserSetting} />}

        {/* Customer Service Route */}
        {ReportState && (influencerCookie === 'C') && <Report onCloseIssue={setReport} />}
      </div>
    </>

  );
}

export default TopHeader;