import { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate } from 'react-router-dom';
import NotificationRightBar from '../../../../../Components/DashBoardTemplate/DashBoard/RightSideBar/NotificationRightBar';

const BrandWork = () => {
  const navItems = ['WorkOverView', 'WorkDetails'];

  return (
    <>
      <Outlet />
    </>
  );
};

export default BrandWork;