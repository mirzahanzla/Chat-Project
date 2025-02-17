import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import './Index.css';
import { DropdownSvg } from '../../../../../Components/Svg/DropDownSvg';
import NavBarItems from '../../../../../Components/NavBar/NavBarItems';

const Home = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    fullName: '',
    website: '',
    photo: null,
    category: [],
    blogs: 0,
    followers: 0,
    bio: '',
    groups: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('authToken');
  
        if (!token) {
          throw new Error('No token found in local storage');
        }
        
        const response = await axios.get('/auth/verifyToken', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const apiData = response.data.user;
        setProfileData({
          fullName: apiData.fullName || '',
          website: apiData.website || '',
          photo: apiData.photo || null,
          category: JSON.parse(apiData.category || '[]'),
          blogs: apiData.blogs.length || 0,
          followers: apiData.followers || '',
          bio: apiData.bio || '',
          groups: apiData.groups,
        });
      } catch (err) {
        console.error('Error fetching profile data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (!loading && !error && profileData) {
      navigate('/Dashboard/OverView');
    }
  }, [profileData, loading, error, navigate]);
  
  const navItems = ['Overview', 'Audience', 'Engagement', 'Influencers', 'Media'];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="sm:grid sm:grid-cols-12 lg:flex lg:w-[900px] lg:mx-auto">
        <div className="px-6 py-3 col-span-12 lg:col-span-9 z-10">
          <ProfileInformation {...profileData} />
          <ul className="flex text-[10px] justify-end xs:justify-center sm:text-base sm:justify-center list-none mt-7">
            <div className="navBgColor hidden xs:flex rounded-full xs:py-2 xs:px-2 sm:flex-nowrap md:px-10 lg:gap-x-4">
              <NavBarItems items={navItems} path={"Dashboard"} />
            </div>

            {/* Display on small screens only */}
            <div className="xs:hidden">
              <Dropdown items={navItems} />
            </div>
          </ul>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

const Dropdown = ({ items }) => {
  const [isOpen, setIsOpen] = useState([false, 'Overview']);

  return (
    <div className="flex items-center flex-col poppins-semibold">
      <div
        className="p-2 flex justify-between w-[100px] navBgColor rounded-full items-center cursor-pointer"
        onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}
      >
        <div>{isOpen[1]}</div>
        <DropdownSvg />
      </div>
      {isOpen[0] && (
        <ul className="poppins-regular flex gap-y-2 flex-col mt-2">
          {items.map((item, index) =>
            isOpen[1] !== item ? (
              <li key={index} className="dropdown-item" onClick={() => setIsOpen([false, item])}>
                {item}
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
};

const ProfileInformation = ({ photo, fullName, website, followers, blogs, bio, category, groups }) => {
  return (
    <>
      <div className="">
        {/* Wrapper div or background of list */}
        <div className="bg-white grid grid-cols-12 OverViewBox2 w-[250px] xs:w-[500px] sm:w-[640px] md:w-[740px] lg:w-[800px] p-1 sm:p-2 mx-auto rounded-xl">
          
          {/* Profile Picture */}
          <div className="col-span-2 flex justify-center items-center">
            <div className="flex size-[60px] xs:size-[80px] sm:size-[100px] md:size-[100px] items-center">
              <img className="aspect-square Avatar" src={photo || "/Media/p1.jpg"} alt="Profile" />
            </div>
          </div>

          {/* Middle part general information */}
          <div className="col-span-7 mt-4 ml-2">
            <p className="poppins-bold text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px]">
              {fullName || 'Name'}
            </p>
            {/* <p className="lato-regular text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] text-black/50">
              insta Profile: 
              <a href={website || '#'} className="text-blue-500 underline">
                {website || 'instagram Profile'}
              </a>
            </p> */}
            <p className="poppins-light  text-[6px] xs:text-[8px] sm:text-[10px] md:text-[11px]">
              {bio || 'Bio goes here'}
            </p>

            <div className='flex '>
            <div className="hidden xs:flex gap-2 mt-2 mb-2">
              {category.length > 0 ? (
                category.map((cat, index) => (
                  <p
                    key={index}
                    className='OrangeButtonBorder text-primary text-[9px] sm:text-[12px] lg:text-[11px] xs:text-[10px] cursor-pointer'
                  >
                    {cat}
                  </p>
                ))
                
              ) : (
                <p className='OrangeButtonBorder text-primary text-[9px] sm:text-[12px] lg:text-[11px] xs:text-[10px] cursor-pointer'>
                  No Categories
                </p>
              )}
            </div>
            <div className="hidden xs:flex gap-2 mt-2 mb-2  ml-2">
              <p className='SilverButtonWithText text-[9px] sm:text-[12px] lg:text-[11px] xs:text-[10px] cursor-pointer'>
                + Edit
              </p>
            </div>
            </div>
          </div>

          {/* Right part with followers and following */}
          <div className="col-span-3 justify-self-center mt-4">
            <div className="flex items-center gap-x-1">
              {/* <img src="/Logo/LogoWhite.jpg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="" /> */}
              <img src="/Svg/Instagram.svg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="" />
              <p className="text-[9px] lato-light xs:text-[10px] sm:text-[11px]">  {followers || '0'} Followers </p>
            </div>
            <div className="hidden xs:flex justify-center gap-x-3 mt-2">
              <div className=" flex items-center gap-x-1 ">
                  <img src="/Svg/Blog2.svg" className="Avatar   xs:size-[15px] sm:h-[16px]" alt="" />
                  <p className="text-[9px] lato-light  xs:text-[10px] sm:text-[11px]">  {blogs || '0'} Blogs</p>
              </div>
              <div className="flex items-center  gap-x-1">
                  <img src="/Svg/Group2.svg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="" />
                  <p className="text-[9px] lato-light  xs:text-[10px] sm:text-[11px]"> { groups || '0' } Groups  </p>
              </div>
            </div>
            <div className="flex gap-2 mt-2 mb-2">
              <div className='SilverButtonWithText cursor-pointer'>
                <img src="/Svg/Saved.svg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="Saved" />
              </div>
              <div className='SilverButtonWithText cursor-pointer'>
                <img src="/Svg/message2.svg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="Messages" />
              </div>
            </div>
          </div>

          {/* End Wrapper div */}
        </div>
        {/* End of influencer List */}
      </div>
    </>
  );
};

export default Home;