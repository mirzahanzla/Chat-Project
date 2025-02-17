import { useState } from 'react';
import { motion } from 'framer-motion';

const NavBarItems = ({ items }) => {
  const [isHover, setIsHover] = useState(-1);
  const [isActive, setIsActive] = useState(0);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          className="poppins-semibold relative px-1 z-50 w-full sm:px-2 text-center sm:py-2 cursor-pointer text-sm"
          onMouseEnter={() => setIsHover(index)}
          onMouseLeave={() => setIsHover(-1)}
          onClick={() => {
            setIsActive(index);
            scrollToSection(item); // Call scrollToSection instead of navigate
          }}
        >
          <li className={`${isActive === index || isHover === index ? 'text-primary' : ''} `}>
            <p>{item}</p>
            {isActive === index && (
              <motion.div layoutId="1" className="absolute w-full bg-white h-full top-0 left-0 p-2 rounded-full -z-10"></motion.div>
            )}
          </li>
        </div>
      ))}
    </>
  );
};

export default NavBarItems;
