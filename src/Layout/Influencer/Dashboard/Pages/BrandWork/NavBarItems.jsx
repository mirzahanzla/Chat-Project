// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NavBarItems = ({ items ,setUser }) => {
  const [isHover, setIsHover] = useState(-1);
  const [isActive, setIsActive] = useState(0);

  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          className="poppins-semibold relative z-50 w-full text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] text-center px-2 py-2 sm:py-2 cursor-pointer list-none"
          onMouseEnter={() => setIsHover(index)}
          onMouseLeave={() => setIsHover(-1)}
          onClick={() => { setIsActive(index) ; setUser(index) }}
        >
          <li className={`${isHover === index ? 'text-primary' : ''} ${isActive === index ? 'text-white' : ''}`}>
            <p>{item}</p>
            {isActive === index && (
              <motion.div layoutId="Deals" className="absolute w-full bg-black h-full top-0 left-0 p-2 rounded-xl -z-10"></motion.div>
            )}
          </li>
        </div>
      ))}
    </>
  );
};

export default NavBarItems;