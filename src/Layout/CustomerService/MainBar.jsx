import { Routes, Route } from 'react-router-dom';
import Home from './DashBoard/Pages/Home/Home';
import OverView from './DashBoard/Pages/Home/OverView';
import ErrorPage from './DashBoard/Pages/ErrorPage/ErrorPage';
import Queries from './DashBoard/Pages/Queries/Queries';
import Contract from './DashBoard/Pages/Queries/Contract';
import Payment from './DashBoard/Pages/Payment/Payment';
import VerifyInfluencer from './DashBoard/Pages/VerifyInfluencer/VerifyInfluencer';
import WithDrawPayment from './DashBoard/Pages/WithDrawPayment/WithDrawPayment';
import ContactUs from './DashBoard/Pages/ContactUs/ContactUs';


const MainBar = () => {
  return (
    <div className='w-full bg-gray-200/90 min-h-screen'>
      <Routes>
        <Route path="/*" element={<Home />}>
          <Route path='Dashboard/*' element={<OverView />} />
          <Route path='OverView' element={<OverView />} />
         


        </Route>
        <Route path='Queries'  >
        <Route index element={<Queries />} />
        <Route path='Contract' element={<Contract />} />
        
        </Route>


        <Route path='Payment'  >
        <Route index element={<Payment />} />
        
        </Route>
        <Route path='ContactUs'  >
        <Route index element={<ContactUs />} />
        
        </Route>
        
        
    
        
        
        
        <Route path='Influencer'  >
        <Route index element={<VerifyInfluencer />} />
        
        </Route>
        <Route path='WithDraw'  >
        <Route index element={<WithDrawPayment />} />
        
        </Route>


        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};



export default MainBar;