import { useEffect, useState ,useLayoutEffect} from 'react';
import Cookies from 'js-cookie';
import { Routes, Route, useNavigate } from 'react-router-dom';
import BrandRoutes from '../Layout/Brand/BrandRoutes';
import InfluencerRoutes from '../Layout/Influencer/InfluencerRoutes';
import UserRoutes from '../Layout/User/UserRoutes';
import Login2 from '../Layout/Login/Login2';
import RootSignUp from '../Layout/SignUp/RootSignUp';
import BrandSignUp from '../Layout/SignUp/BrandSignUp';
import InfluencerSignUp from '../Layout/SignUp/InfluencerSignUp';
import UserSignUp from '../Layout/SignUp/UserSignUp';
import CustomerRoutes from '../Layout/CustomerService/CustomerRoutes';

function Authentication() {
  const [component, setComponent] = useState(null);

  const navigate = useNavigate();

  let routes={
    'B':'Brand',
    'I':'Influencer',
    'U':'User'
  }

  // useLayoutEffect(() => {
  //   const userCookie = Cookies.get('U');
  //   const profileCookie = Cookies.get('pC');
  //   console.log(userCookie);
  //   console.log(profileCookie);
  //   if (userCookie) {
  //     if (profileCookie === '0') {
  //       navigate(`/SignUp/${routes[userCookie]}`)
  //     } else {
  //       if (userCookie.includes('B')) {
  //         setComponent(<BrandRoutes />);
  //       } else if (userCookie.includes('I')) {
  //         setComponent(<InfluencerRoutes />);
  //       } else if (userCookie.includes('A')) {
  //         setComponent(<UserRoutes />);
  //       } 
  //     }
  //   } else {
  //     // Handle case where userCookie is not present (e.g., redirect to login page)
  //     setComponent('');
  //   }

  //   // if (cookie) {
  //   //   if (cookie.includes('B')) {
  //   //     setComponent(<BrandRoutes />);
  //   //   } else if (cookie.includes('I')) {
  //   //     setComponent(<InfluencerRoutes />);
  //   //   } else if (cookie.includes('A')) {
  //   //     setComponent(<UserRoutes />);
  //   //   } 
  //   // } 
  // }, []);
  


  useEffect(() => {


  
    const fetchCookies = async () => {
      // Use a delay to simulate cookie fetching if needed
      // await new Promise(resolve => setTimeout(resolve, 100)); // Optional

      const userCookie =  Cookies.get('U');
      const profileCookie = Cookies.get('pC');
      const token = Cookies.get('token');

      console.log('User Cookie:', userCookie);
      console.log('Profile Cookie:', profileCookie);
      console.log('token:', token);

      if (userCookie && token) {
        if (profileCookie === '0') {
          navigate(`/SignUp/${userCookie}`); // Ensure `routes` is defined
        } else {
          if (userCookie.includes('b')) {
            setComponent(<BrandRoutes />);
          } else if (userCookie.includes('B')) {
            setComponent(<BrandRoutes />);
          }else if (userCookie.includes('i')) {
            setComponent(<InfluencerRoutes />);
          } else if (userCookie.includes('U')) {
            setComponent(<UserRoutes />);
          } 
          else if (userCookie.includes('C')) {
            setComponent(<CustomerRoutes />);
          } 
        }
      } else {
        navigate('/login'); // Redirect to login if no userCookie
      }
    };

    fetchCookies();
  }, [navigate]);

  return (
    component || ( <>
    <div>
      orr cookie is not there 
      Front Page is Under-Construction .Please proceed to <a  className='Button poppins-regular rounded-md  py-[5px] md:py-[6px] text-[12px] px-5 cursor-pointer' href="/Login">Login</a>
    </div>
    </>)
    // component || (
    //   <Routes>
        
    //     <Route path="/" element={<Login2 />} />
        
    //     {/* Nested routes under /SignUp */}
    //     <Route path="/SignUp/*" element={<RootSignUp />}>
    //       <Route index element={<RootSignUp />} />
    //       <Route path="Brand" element={<BrandSignUp />} />
    //       <Route path="Influencer" element={<InfluencerSignUp />} />
    //       <Route path="User" element={<UserSignUp />} />
    //     </Route>

       
    //   </Routes>
    // )
  );
}

const Frontpage = () => {
  return (
    <>
    To be made :Rizwan Sabir
    </>
  )
}

export default Authentication;
