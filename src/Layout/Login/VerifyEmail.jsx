import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './index.css';
import axios from 'axios';
import Loader from '../../Components/Loaders/Loaders';
import PopOver from '../../Components/PopOver';

const VerifyEmail = () => {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopOver, setShowPopOver] = useState(false); // State to control pop-over visibility
  const location = useLocation();
  const { email } = location.state || {};
  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;

  const handleReSendEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/Newauth/users/resend`, { email: email || "sp21-bse-033@cuilahore.edu.pk" });
      setMsg(response.data.message || "Verification email has been resent.");
      setError("");
      setShowPopOver(false); // Hide pop-over if successful
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend email.");
      setMsg("");
      setShowPopOver(true); // Show pop-over if there's an error
    } finally {
      setLoading(false);
    }
  };

  const closePopOver = () => {
    setShowPopOver(false); // Close the pop-over when dismissed
  };

  return (
    <>
      {loading && <Loader />}

      {/* Pop-Over for Errors */}
      <AnimatePresence>      {showPopOver && <PopOver msg={error} closePopOver={closePopOver} />
      }

      </AnimatePresence>


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
                <p className='text-center poppins-semibold mt-1 text-[14px] sm:text-xl'>Verify Your Email</p>
                <div className="w-full sm:p-4">
                  <div className='mx-auto flex flex-col justify-center text-center'>
                    <p className='poppins-light'>A verification email has been sent to <span className="poppins-semibold">{email}</span>. Please click on the link to verify your account.</p>
                    <div>
                      <button onClick={handleReSendEmail} className='Button poppins-regular rounded-md py-[5px] md:py-[6px] px-5 cursor-pointer' disabled={loading}>
                        Resend Email
                      </button>
                    </div>
                    {msg && <div className="text-green-500 mt-2">{msg}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
