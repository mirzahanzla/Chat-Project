import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const renderMenuItems = (setSideBar, navigate,menuItems) => {
  return menuItems.map((item, index) => (
    <div
      key={index}
      onClick={() => {
        navigate(item.navigate);
        setSideBar(false);
      }}
      className='flex gap-3 w-[150px] flex items-center my-3 cursor-pointer'>
      {item.icon}
      <p>{item.label}</p>
    </div>
  ));
};

const HiddenSideBar = ({ SideBar, setSideBar,menuItems }) => {
  const navigate = useNavigate();
  return (
    <>
      <motion.div
        style={{ x: -500 }}
        animate={SideBar ? { x: 0 } : { x: -500 }}
        transition={{ type: 'tween' }}
        className='w-[300px] h-screen bg-black z-10 absolute text-white'>
        <ul className='flex flex-col items-center h-full justify-center'>
          {renderMenuItems(setSideBar, navigate,menuItems)}
        </ul>
      </motion.div>
    </>
  );
};

export default HiddenSideBar;
