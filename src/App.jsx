import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BrandRoutes from './Layout/Brand/BrandRoutes'
import SplashScreen from './Layout/SplashScreen';
import { useRef, useState, useEffect } from 'react';
import './index.css';
import InfluRoutes from './Layout/Influencer/InfluencerRoutes';
import InfluencerRoutes from './Layout/Influencer/InfluencerRoutes';
import UserRoutes from './Layout/User/UserRoutes';

import ErrorPage from './Layout/Brand/DashBoard/Pages/ErrorPage/ErrorPage';
import Test from './Test';
import Authentication from './Routes/Authentication';
import RootSignUp from './Layout/SignUp/RootSignUp';
import BrandSignUp from './Layout/SignUp/BrandSignUp';
import InfluencerSignUp from './Layout/SignUp/InfluencerSignUp';
import UserSignUp from './Layout/SignUp/UserSignUp';
import PasswordReset from './Layout/Login/PasswordReset';
import EmailVerify from './Layout/Login/EmailVerify';
import VerifyEmail from './Layout/Login/VerifyEmail';
import ForgetPassword from './Layout/Login/ForgetPassword';
import Login2 from './Layout/Login/Login2';
import CustomerRoutes from './Layout/CustomerService/CustomerRoutes';
import CustomerLogin from './Layout/Login/CustomerLogin';

const App = () => {

  const TimeOutAnimation = useRef()

  const [AnimationState, setAnimationState] = useState(true)

  
  console.log("App is called");

  return (

    <>

      <div className=" ">
        <BrowserRouter>




          <Routes>

            <Route path="/check/users/:id/reset-password/:token" element={<PasswordReset />} />
            <Route path="/admin" element={<CustomerLogin />} />
            <Route path="/check/users/:id/verify/:token" element={<EmailVerify />} />
            <Route path="/Login" element={<Login2 />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />

            <Route path="/SignUp/*" element={<RootSignUp />}>
              <Route index element={<RootSignUp />} />
              <Route path="Brand" element={<BrandSignUp />} />
              <Route path="Influencer" element={<InfluencerSignUp />} />
              <Route path="User" element={<UserSignUp />} />
            </Route>

            <Route path="/*" element={<Authentication />} />
            {/* <Route path="/*" element={<CustomerRoutes />} />  */}


          </Routes>



{/* <Routes>
  <Route path='/*' element={<CustomerRoutes/>}/>
</Routes> */}

        </BrowserRouter>

      </div>

    </>

  )
}

export default App;