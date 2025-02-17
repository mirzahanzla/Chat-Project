import { Routes,Route } from 'react-router-dom';
import  './Index.css';
import Home from '../Pages/Home/Home';
import Search from '../Pages/Search/Search';
import Saved from '../Pages/Saved/Saved';
import Group from '../Pages/Group/Group';
import Message from '../Pages/Message/Message';
import Info from '../Pages/Info/Info';
import Compaign from '../Pages/Compaign/Compaign';
const MainBar = () => {
  return (
    <>

    <div className='w-full bg-gray-200/90 h-full '>
    <Routes>

        <Route index path="/"  element={<Home />} />
        <Route  path="/Search" element={<Search />} />
        <Route path="/Compaign" element={<Compaign />} />
        <Route path="/Saved" element={<Saved />} />
        <Route path="/Group" element={<Group />} />
        <Route path="/Message" element={<Message />} />
        <Route path="/Info" element={<Info />} />
        
 
    </Routes> 
   
   </div>
    </>
  )
}

export default MainBar;