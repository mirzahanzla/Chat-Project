import { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate } from 'react-router-dom';
import NotificationRightBar from '../../../../../Components/DashBoardTemplate/DashBoard/RightSideBar/NotificationRightBar';

const WD = () => {
  const navItems = ['WorkOverView'];
  const navigate = useNavigate();

  return (
    <div className="sm:grid sm:grid-cols-12">
      <div className="col-span-12">
        {/* Giving gap of h-1 */}
        <div className="bg-gray-200/90 h-1"></div>

        <ul className="bg-white sm:mr-1 py-1 sm:py-2">
          <div className="flex w-[200px] sm:w-[300px] mx-auto sm:ml-10">
            <NavBarItems items={navItems} />
          </div>
        </ul>

        <Outlet />
      </div>

    </div>
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
          className="poppins-semibold relative z-50 w-full text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] text-center px-2 py-2 sm:py-2 cursor-pointer"
          onMouseEnter={() => setIsHover(index)}
          onMouseLeave={() => setIsHover(-1)}
          onClick={() => {
            setIsActive(index);
            navigate(`/BrandWork/WD/${item}`);
          }}
        >
          <li className={`${isHover === index ? 'text-primary' : ''} ${isActive === index ? 'text-white' : ''}`}>
            <p>{item}</p>
            {isActive === index && (
              <motion.div
                layoutId="Deals"
                className="absolute w-full bg-black h-full top-0 left-0 p-2 rounded-xl -z-10"
              />
            )}
          </li>
        </div>
      ))}
    </>
  );
};

export default WD;