import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import { useLayoutEffect } from 'react';
import VerifyEmail from '../../Login/VerifyEmail';



const EmailVerify = () => {
  const ServerUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
  const [validUrl, setValidUrl] = useState(false);
  const { id, token } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    let cancelToken;

    const verifyEmailUrl = async () => {
      try {
        const url = `${ServerUrl}/Newauth/users/${id}/verify/${token}`;
        cancelToken = axios.CancelToken.source();
        const { data } = await axios.get(url, {
          cancelToken: cancelToken.token,
        });
        console.log("Check is ", data.check);
        setValidUrl(true);
        // Navigate to login page after successful verification
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.log(error);
          setValidUrl(false);
        }
      }
    };

    verifyEmailUrl();

    return () => {
      if (cancelToken) {
        cancelToken.cancel("Operation canceled due to new request.");
      }
    };
  }, [ServerUrl, id, token, navigate]);

  return (
    <>
      {!validUrl ? (
        <h1>Checking...</h1>
      ) : (
        <EmailVerified navigate={navigate} />
      )}
    </>
  );
};


const EmailVerified = ({ navigate }) => {
  const handleLogin = () => {
    navigate('/login'); // Adjust the path as needed
  };

  return (
    <div className='h-screen items-center sm:h-[550px] lg:h-screen flex bgSignUp text-[10px] sm:text-[11px] mdm:text-[12px]'>
      <div className={`w-9/12 mx-auto my-10 rounded-3xl relative sm:h-[500px] overflow-hidden BarColor`}>
        <div className="flex justify-between items-center mx-10 pt-2">
          <div>
            <img className="bg-transparent w-8 sm:w-12 lg:w-20" src="/Logo/Logo.jpg" alt="" />
          </div>
          <img className="w-[240px]" src="/Logo/LogoText.jpg" alt="" />
          <div></div>
        </div>

        <div className='flex items-center'>
          <img className="hidden lg:flex w-96 absolute bottom-0 right-[5px] z-20" src="/Svg/VerifyEmail.svg" alt="" />
          <motion.img layout initial={{ y: 100 }} animate={{ y: 0 }} className="absolute hidden md:block -bottom-28 z-20 -left-[250px] lg:-left-[200px]" src="/Images/Mask_Group.png" alt="" />

          <div className="w-full flex justify-center items-center h-[400px] lg:h-[300px] px-10">
            <div className="w-[500px]">
              <p className='text-center poppins-semibold mt-1 text-[14px] sm:text-xl '>Email Verified Successfully</p>
              <div className="w-full sm:p-4">
                <div className='mx-auto flex flex-col justify-center text-center'>
                  <p className='poppins-light'>Please Click below to Login</p>
                  <div>
                    <button onClick={handleLogin} className='Button poppins-regular rounded-md py-[5px] md:py-[6px] px-5 cursor-pointer' >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default EmailVerify