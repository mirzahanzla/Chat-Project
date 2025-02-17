import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './index.css';
import LoginSignNavBar from '../../Components/LoginSignNavBar/LoginSignNavBar';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Loader from '../../Components/Loaders/Loaders'; // Import your loader component
import PopOver from '../../Components/PopOver';

import PasswordInput from '../../Components/Input/PasswordInput';
import useOnlineStatus from '../Hooks/useOnlineStatus';

const Login2 = () => {
  let [User, setUser] = useState(['Brand', 'brand']);
  let [Page, setPage] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [showPopOver, setShowPopOver] = useState(false); // State to control pop-over visibility


  const isOffline = useOnlineStatus();

  // const url = `${import.meta.env.VITE_SERVER_BASE_URL}/Newauth/auth`;
  const { register, handleSubmit, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    clearErrors(); // Clear all errors when page changes
  }, [Page, clearErrors]); // This effect runs every time `Page` changes

  const navigate = useNavigate();

  const NavigateClick = async (data) => {
    setLoading(true); // Start loading when button is clicked

    if (Page) {
      try {
        const { data: res } = await axios.post('/Newauth/auth', { ...data, userType: User[1] }, {
          withCredentials: true, // Important to include cookies
        });
        console.log("response is  and check the token in it ")
        console.log(res)
        // Store the token in localStorage
        if (localStorage.getItem('authToken')) {
          localStorage.removeItem('authToken');
        }
        localStorage.setItem('authToken', res.token);
        setMsg(res.token);
        navigate('/Dashboard');
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          setError(error.response.data.message);
          setShowPopOver(true); // Show pop-over if there's an error
        }
      } finally {
        setLoading(false); // Stop loading when API call completes
      }
    } else {
      try {
        const url = '/Newauth/users';
        const { data: res } = await axios.post(url, { ...data, userType: User[1] }, { withCredentials: true });
        setMsg(res.message);
        navigate('/verify-email', { state: { email: data.email } });
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          setError(error.response.data.message);
          setShowPopOver(true); // Show pop-over if there's an error
        }
      } finally {
        setLoading(false); // Stop loading when API call completes
      }
    }
  };

  const closePopOver = () => {
    setShowPopOver(false); // Close the pop-over when dismissed
  };

  return (
    <div className='h-screen items-center sm:h-[550px] lg:h-screen flex text-10px bgSignUp text-[12px]'>
      {/* Loader Modal */}
      {loading && <Loader />}

      {/* Pop-Over for Errors */}

      {/* Pop-Over for Errors */}
      <AnimatePresence>  {isOffline && <PopOver msg="You are offline. Please check your internet connection." closePopOver={closePopOver} />}    {showPopOver && <PopOver msg={error} closePopOver={closePopOver} />}
      </AnimatePresence>


      {/* Middle Container */}
      <div className={`w-8/12 mx-auto BarColor my-10 rounded-3xl overflow-hidden relative`}>
        <div className="flex justify-between items-center mx-10 pt-2">
          <div>
            <img className="bg-transparent w-8 sm:w-12 lg:w-20" src="/Logo/Logo.jpg" alt="" />
          </div>
          <img className="w-[240px]" src="/Logo/LogoText.jpg" alt="" />
          <h1 className="hidden sm:flex poppins-semibold border-2 text-center text-white rounded-xl bg-black py-[4px] text-[7px] sm:text-[10px] px-2">Home</h1>
        </div>

        <div className='flex items-center'>
          {Page ? (
            <img className="hidden md:flex w-96 absolute bottom-0 -right-[100px] z-20" src="/Images/undraw_influencer.svg" alt="" />
          ) : (
            <img className="hidden lg:block w-[600px] absolute -left-[160px] bottom-0 z-20" src="/Images/undraw_2.svg" alt="" />
          )}
          <motion.img
            layout
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className={`absolute hidden md:block -bottom-28 z-10 pointer-events-none ${Page ? "-left-[250px] lg:-left-[200px]" : "-right-[250px] z-30"}`}
            src="/Images/Mask_Group.png"
            alt=""
          />
          <div className={`w-full flex ${Page ? "justify-center" : "justify-center sm:justify-end"}`}>
            <div className="w-[500px]">
              <p className='text-center poppins-semibold mt-1 text-[12px] sm:text-xl'>{Page ? 'Login' : 'Sign Up'}</p>
              <div className="w-full">
                <div className="sm:p-4">
                  <LoginSignNavBar User={User} setUser={setUser} />
                  <div className='w-8/12 mx-auto'>
                    <div className='my-2'>
                      <p className='poppins-light text-[9px] sm:text-[12px]'>Email</p>
                      <input type="email" {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email address" } })} className='inputField rounded-md' id={`email`} />
                      {errors.email && <p className={`poppins-extralight text-[8px] pt-[5px] sm:text-[12px] ${errors.password ? 'text-red-500 text-[12px]' : ""}`}>{errors.email.message}</p>}
                    </div>

                    <div className='my-2 z-50'>
                      <p className='poppins-light text-[8px] sm:text-[12px]'>Password</p>

                      <PasswordInput
                        register={register}
                        validation={{
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must contain at least one uppercase letter, one number, one letter, and one special character",
                          },
                          pattern: {
                            value: /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: "Password must contain at least one uppercase letter, one number, one letter, and one special character",
                          }
                        }}
                      />
                    </div>

                    {Page ? <p className={`poppins-extralight text-[8px] sm:text-[12px] ${errors.password ? 'text-red-500 text-[12px]' : ""}  select-none`}>Use 8 or more characters with one uppercase letter, one number, one letter, and one special character</p> : errors.password && <p className={`poppins-extralight text-[8px] pt-[5px] sm:text-[12px] ${errors.password ? 'text-red-500 text-[12px]' : ""}`}>{errors.password.message}</p>}
                    <button
                      onClick={handleSubmit(NavigateClick)}
                      className='Button poppins-regular rounded-md py-[5px] md:py-[6px] text-[12px] px-5 cursor-pointer'
                      disabled={loading} // Disable button while loading
                    >
                      {Page ? "Login" : "Sign Up"}
                    </button>

                    <p className='poppins-light mt-1 sm:my-1 text-[8px] sm:text-[12px]'>{Page ? "Create an account?" : "Already have an account?"} <a
                      className='underline cursor-pointer text-[8px] sm:text-[12px]' onClick={() => {
                        setPage((prev) => !prev);
                      }}>{Page ? "Sign Up" : "Login"}</a></p>
                    {Page && <a href='/forgetPassword' className='poppins-light underline cursor-pointer text-[8px] sm:text-[12px]'>Forget Password</a>}
                  </div>

                  {msg && <div>{msg}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login2;
