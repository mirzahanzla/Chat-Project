import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import './Index.css';
import { DropdownSvg } from '../../../../../Components/Svg/DropDownSvg';
import NavBarItems from '../../../../../Components/NavBar/NavBarItems';
import RightSideBar from '../../../../../Components/DashBoardTemplate/DashBoard/RightSideBar/RightSideBar';

const Home = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ brandName: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log("Auth token is ")
        console.log(token)
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
          brandName: apiData.fullName || '',
        });
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.response?.data?.message || err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (!loading && !error && profileData.brandName) {
      navigate('/Dashboard/OverView');
    }
  }, [profileData, loading, error, navigate]);

  const navItems = ['Overview', 'Audience', 'Engagement', 'Influencers', 'Spendings'];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="sm:grid sm:grid-cols-12 lg:flex lg:w-[900px] lg:mx-auto">

        <div className="px-6 py-3 col-span-12 lg:col-span-12 z-10">
            <h1 className="lato-bold text-xl">Welcome, {profileData.brandName || 'User'}</h1>
          <div>
          </div>
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

        {/* <RightSideBar /> */}
      </div>
    </>
  );
};

const Dropdown = ({ items }) => {
  const [isOpen, setIsOpen] = useState([false, 'Overview']);

  if (!Array.isArray(items)) {
    console.error('Dropdown items prop should be an array');
    return null;
  }

  return (
    <div className="flex items-center flex-col poppins-semibold">
      <div
        className="p-2 flex justify-between w-[100px] navBgColor rounded-full items-center"
        onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}
      >
        <div>{isOpen[1]}</div>
        <DropdownSvg />
      </div>
      {isOpen[0] ? (
        <ul className="poppins-regular flex gap-y-2 flex-col mt-2">
          {items.map((item, index) =>
            isOpen[1] !== item ? (
              <li key={index} className="dropdown-item" onClick={() => setIsOpen([false, item])}>
                {item}
              </li>
            ) : null
          )}
        </ul>
      ) : null}
    </div>
  );
};

export default Home;