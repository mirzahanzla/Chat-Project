import { useState } from 'react';
import { motion } from 'framer-motion';
import './Index.css';
import { DropdownSvg } from '../../../../Svg/DropDownSvg';

const Home = ({ TopMessage, date, navItems = ['OverView', 'Audience', 'Engagement', 'Spendings', 'Influencers', 'Media'], children }) => {
  return (
    <div className="px-6 py-3">
      {/* Display the welcome message */}
      <div>
        <h1 className="lato-bold text-xl">Welcome, Rizwan Sabir</h1>
        <h1 className="lato-regular text-sm text-black/50">{date}</h1>
      </div>

      {/* Navigation items */}
      <ul className="flex text-[10px] justify-end sm:text-base sm:justify-center list-none mt-7">
        <div className="navBgColor hidden xs:flex rounded-full xs:py-2 xs:px-2 sm:flex-nowrap md:px-10 md:py-2 lg:gap-x-4">
          <NavItems names={navItems} />
        </div>

        {/* Dropdown for small screens */}
        <div className="xs:hidden">
          <Dropdown items={navItems} />
        </div>
      </ul>
    </div>
  );
};

const NavItems = ({ names }) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {names.map((name, index) => (
        <div
          key={index}
          className="poppins-semibold relative px-1 z-50 w-full sm:px-2 text-center sm:py-2 cursor-pointer text-sm"
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(-1)}
          onClick={() => setActiveIndex(index)}
        >
          <li className={activeIndex === index || hoverIndex === index ? 'text-primary' : ""}>
            <p>{name}</p>

            {/* Highlight background when active */}
            {activeIndex === index && (
              <motion.div
                layoutId="1"
                className="absolute w-full bg-white h-full top-0 left-0 p-2 sm:p-5 rounded-full -z-10"
              />
            )}
          </li>
        </div>
      ))}
    </>
  );
};

const Dropdown = ({ items }) => {
  const [isOpen, setIsOpen] = useState([false, 'OverView']);

  return (
    <div className="flex items-center flex-col poppins-semibold">
      <div
        className="p-2 flex justify-between w-[100px] navBgColor rounded-full items-center"
        onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}
      >
        <div>{isOpen[1]}</div>
        <div><DropdownSvg /></div>
      </div>

      {/* Display dropdown list when open */}
      {isOpen[0] && (
        <ul className="poppins-regular flex gap-y-2 flex-col mt-2">
          {items.map((item, index) => (
            isOpen[1] !== item && (
              <li
                key={index}
                className="dropdown-item"
                onClick={() => setIsOpen([false, item])}
              >
                {item}
              </li>
            )
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;