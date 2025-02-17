import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import './Index.css';
import { DropdownSvg } from '../../../../../Components/Svg/DropDownSvg';
import NavBarItems from '../../../../../Components/NavBar/NavBarItems';
import RightSideBar from '../../../../../Components/DashBoardTemplate/DashBoard/RightSideBar/RightSideBar';

const Home = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate('/Dashboard/OverView')
  // }, [])

  return (
    <>
      <div className="sm:grid sm:grid-cols-12">
        <div className="px-6 py-3 col-span-12 lg:col-span-12 mx-auto">
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

const Dropdown = ({ items }) => {
  const [isOpen, setIsOpen] = useState([0, 'Overview']);

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
              <li key={index} className="dropdown-item" onClick={() => setIsOpen([0, item])}>
                {item}
              </li>
            ) : null
          )}
        </ul>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;