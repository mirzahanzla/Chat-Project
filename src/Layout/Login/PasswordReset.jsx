import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../Components/Loaders/Loaders';
import PopOver from '../../Components/PopOver';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const PasswordReset = () => {
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [showPopOver, setShowPopOver] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;

  // Extract token from URL
  const { token } = useParams();

  // React Hook Form setup
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    // Validate the token on component mount
    const validateToken = async () => {
      try {
        const response = await axios.get(`${url}/Newauth/users/validate-reset-token/${token}`);
        if (response.data.valid) {
          setIsValidToken(true);
        } else {
          setError("Invalid or expired token.");
          setShowPopOver(true);
        }
      } catch (err) {
        setError("Failed to validate token.");
        setShowPopOver(true);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, url]);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("Passwords do not match.");
      setShowPopOver(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${url}/Newauth/users/reset-password`, { token, newPassword: data.newPassword });
      setMsg(response.data.message || "Password has been reset successfully.");
      setError("");
      setPasswordResetSuccess(true);
      setShowPopOver(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
      setShowPopOver(true);
    } finally {
      setLoading(false);
    }
  };

  const closePopOver = () => {
    setShowPopOver(false);
    if (!error && passwordResetSuccess) navigate('/login'); // Redirect to login page on successful reset
  };

  return (
    <>
      {loading && <Loader />}

      {/* Pop-Over for Errors or Success */}
      {showPopOver && <PopOver msg={error || msg} closePopOver={closePopOver} />}

      <div className='h-screen flex items-center justify-center bgSignUp text-[10px] sm:text-[11px] mdm:text-[12px]'>
        <div className='w-9/12 mx-auto my-10 rounded-3xl relative sm:h-[500px] overflow-hidden BarColor'>
          <div className="flex justify-between items-center mx-10 pt-2">
            <div>
              <img className="bg-transparent w-8 sm:w-12 lg:w-20" src="/Logo/Logo.jpg" alt="" />
            </div>
            <img className="w-[240px]" src="/Logo/LogoText.jpg" alt="" />
            <div></div>
          </div>
          <img className="hidden lg:flex w-96 absolute bottom-0 right-[5px] z-20" src="/Svg/PasswordReset.svg" alt="" />
          <motion.img layout initial={{ y: 100 }} animate={{ y: 0 }} className="absolute hidden md:block -bottom-28 z-20 -left-[250px] lg:-left-[200px]" src="/Images/Mask_Group.png" alt="" />

          <div className="flex justify-center items-center h-[400px] lg:h-[300px] px-10">
            <div className="w-[500px]">
              <p className='text-center poppins-semibold mt-1 text-[14px] sm:text-xl'>
                {isValidToken ? (passwordResetSuccess ? 'Password Reset Successful' : 'Reset Your Password') : 'Token Invalid or Expired'}
              </p>
              <div className="w-full sm:p-4">
                <div className='mx-auto flex flex-col justify-center text-center'>
                  {isValidToken && !passwordResetSuccess ? (
                    <>
                      <p className='poppins-light'>Enter your new password below and confirm it to reset your password.</p>
                      <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
                        <div className='mt-4'>
                          <input
                            type="password"
                            {...register("newPassword", {
                              required: "Password is required",
                              minLength: { value: 8, message: "Password must be at least 8 characters long" },
                              pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: "Password must contain at least one uppercase letter, one number, one letter, and one special character"
                              }
                            })}
                            placeholder="New Password"
                            className='inputField rounded-md'
                          />
                          {errors.newPassword && <p className='text-red-500'>{errors.newPassword.message}</p>}
                        </div>
                        <div className='mt-4'>
                          <input
                            type="password"
                            {...register("confirmPassword", {
                              required: "Please confirm your password"
                            })}
                            placeholder="Confirm Password"
                            className='inputField rounded-md'
                          />
                          {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
                        </div>
                        <div className='mt-4'>
                          <button
                            type="submit"
                            className='Button poppins-regular rounded-md py-[5px] md:py-[6px] px-5 cursor-pointer'
                            disabled={loading}
                          >
                            Reset Password
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    passwordResetSuccess && (
                      <div>
                        <p className='poppins-light'>Your password has been reset successfully.</p>
                        <button
                          className='Button poppins-regular rounded-md py-[5px] md:py-[6px] px-5 mt-4 cursor-pointer'
                          onClick={() => navigate('/login')}
                        >
                          Login to continue
                        </button>
                      </div>
                    )
                  )}
                  {!isValidToken && <p className='poppins-light text-red-500'>{error}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
