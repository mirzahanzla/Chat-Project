import { useState ,useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import './Index.css';
import { DropdownSvg } from '../../../../../Components/Svg/DropDownSvg';

const Home = () => {
  const navigate=useNavigate()

useEffect(() => {
  navigate('/Dashboard/OverView')
}, [])


  const navItems = ['Overview', 'Audience', 'Engagement', 'Spendings', 'Influencers', 'Media'];

  return (
   <>
   <div className=" sm:grid sm:grid-cols-12 w-full   ">
   <div className="px-6 py-3 col-span-12 lg:w-[900px] lg:mx-auto">
      <div>
        <h1 className="lato-bold text-xl">Welcome, Rizwan Sabir</h1>
        <h1 className="lato-regular text-sm text-black/50">27 March 20</h1>
      </div>
      
      <div className=' w-full'>
       <Outlet/>
      </div>
    </div>


   </div>
   
   </>
  );
};






export default Home;
