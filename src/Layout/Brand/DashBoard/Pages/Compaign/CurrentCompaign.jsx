import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { motion } from 'framer-motion';
import { DropdownSvg } from '../../../../../Components/Svg/DropDownSvg';

// Outlet context for passing data
export const CampaignContext = createContext(null);

const CurrentCompaign = () => {
  const location = useLocation();
  const [campaignData, setCampaignData] = useState(null);

  // Fetch campaign data from location state or localStorage
  useEffect(() => {
    const fetchCampaignData = () => {
      try {
        const storedCampaignData = localStorage.getItem('campaignData');
        if (storedCampaignData) {
          setCampaignData(JSON.parse(storedCampaignData));
        } else if (location.state?.campaign) {
          const campaign = location.state.campaign;
          setCampaignData(campaign);
          localStorage.setItem('campaignData', JSON.stringify(campaign));
        }
      } catch (error) {
        console.error("Failed to parse campaign data from localStorage:", error);
        localStorage.removeItem('campaignData'); // Remove corrupted data
      }
    };

    fetchCampaignData();
  }, [location.state?.campaign]);

  // Save campaign data to localStorage if it changes
  useEffect(() => {
    if (campaignData) {
      try {
        const storedCampaign = localStorage.getItem('campaignData');
        if (!storedCampaign || storedCampaign !== JSON.stringify(campaignData)) {
          localStorage.setItem('campaignData', JSON.stringify(campaignData));
        }
      } catch (error) {
        console.error("Failed to save campaign data to localStorage:", error);
      }
    }
  }, [campaignData]);

  // Clear campaign data from localStorage when leaving the page
  useEffect(() => {
    return () => {
      localStorage.removeItem('campaignData');
    };
  }, []);

  let pages = [['Compaign',''], ['Workflow','Workflow'], ['Content','Content'], ['Payment','Payment'], ['Report','Report']];
  const navItems = ['Compaign', 'Workflow', 'Content', 'Payment', 'Report'];

  return (
    <CampaignContext.Provider value={campaignData}>
      <div className="sm:w-[500px] mx-auto pt-5">
        <p className="poppins-semibold">Clothing Dev'23</p>
        <div className="navBgColor hidden sm:flex rounded-full xs:py-2 xs:px-2 sm:flex-nowrap md:px-10 lg:gap-x-4 mt-5">
          <NavBarItems items={pages} id="Compaign" />
        </div>
        <div className="sm:hidden">
          <Dropdown items={navItems} />
        </div>
      </div>
      <div className="mt-5">
        <Outlet />
      </div>
    </CampaignContext.Provider>
  );
};

const NavBarItems = ({ items }) => {
  const [isHover, setIsHover] = useState(-1);
  const [isActive, setIsActive] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          className="poppins-semibold relative px-1 z-50 w-full text-center py-1 cursor-pointer text-[10px]"
          onMouseEnter={() => setIsHover(index)}
          onMouseLeave={() => setIsHover(-1)}
          onClick={() => {
            setIsActive(index);
            navigate(`${item[1]}`);
          }}
        >
          <li className={`${isActive === index || isHover === index ? 'text-primary' : ''} list-none`}>
            <p>{item[0]}</p>
            {isActive === index && (
              <motion.div layoutId="Compaign" className="absolute w-full bg-white h-full top-0 left-0 p-2 rounded-full -z-10"></motion.div>
            )}
          </li>
        </div>
      ))}
    </>
  );
};

const Dropdown = ({ items }) => {
  const [isOpen, setIsOpen] = useState([0, 'Overview']);

  return (
    <div className="flex items-end mr-3 flex-col poppins-semibold">
      <div
        className="p-1 flex justify-center w-[100px] navBgColor rounded-full items-center text-[10px]"
        onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}
      >
        <div>{isOpen[1]}</div>
        <DropdownSvg />
      </div>
      {isOpen[0] ? (
        <ul className="poppins-regular flex gap-y-2 flex-col mt-2 text-[10px]">
          {items.map((item, index) =>
            isOpen[1] !== item ? (
              <li key={index} className="dropdown-item" onClick={() => setIsOpen([0, item])}>
                {item}
              </li>
            ) : null
          )}
        </ul>
      ) : ""}
    </div>
  );
};

export default CurrentCompaign;