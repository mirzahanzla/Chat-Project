import Logo from '../../Components/Logo/Logo';
import { motion, MotionConfig } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './index.css';
import LoginSignNavBar from '../../Components/LoginSignNavBar/LoginSignNavBar';
import NavBar from './NavBar';
import Cookies from 'js-cookie';
import axios from "axios";
import { useState, useEffect, useRef } from 'react';
import ScreenSizeDisplay from '../../useCurrentScreenSize';
import Loader from '../../Components/Loaders/Loaders';

const InfluencerSignUp = () => {
  const [stepperIndex, setStepperIndex] = useState(0);
  const [formData, setFormData] = useState({
    basicDetails: {},
    termsAccepted: false,
  });

  const handleBasicDetailsChange = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      basicDetails: data,
    }));
  };

  const nextStep = () => {

    if (stepperIndex < 3) {
      setStepperIndex(stepperIndex + 1);
    }
  };

  const prevStep = () => {
    if (stepperIndex > 0) {
      setStepperIndex(stepperIndex - 1);
    }
  };

  console.log(stepperIndex);
  return (
    <>
      <div className=' w-fullh-[580px]  items-center  lg:h-screen flex text-10px bgSignUp   text-[8px] sm:text-[7px] mdm:text-[10px]'>

        {/* Middle Container */}
        <motion.div layout className={`${stepperIndex < 3 ? "xs:w-10/12" : 'xs:w-11/12'} mx-auto   BarColor my-10 h-[650px] xs:h-[650px] sm:h-[550px] mdm:h-[520px]    xs:rounded-3xl  overflow-hidden  relative  `}>

          <div className="flex flex-col mx-2 xs:mx-5 md:mx-10    pt-2">

            <div className="flex justify-between  items-center" >
              <img className="bg-transparent w-44 xs:w-40 md:w-44 lg:w-56 " src="/Logo/LogoText.jpg" alt="" />
              <h1 className=" BlackButtonWithText-v1 hidden sm:flex poppins-semibold border-2 text-center text-white rounded-xl bg-black h-[34px]    items-center  text-[7px]  sm:text-[10px] px-4    " > Home</h1>
            </div>
            <div className="w-[290px] md:w-[700px] mt-10 mx-auto xs:flex justify-between items-center">

              {stepperIndex > 0 && stepperIndex < 2 ? <img className="cursor-pointer w-[15px] h-[15px] sm:w-[20px] sm:h-[20px]  mb-3 xs:mb-0" onClick={prevStep} src="/Svg/BackButton.svg" /> : ""}

              <div className="w-[190px] mx-auto xs:flex-grow ">
                {stepperIndex < 2 ? <NavBar
                  stepperIndex={stepperIndex}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  setStepperIndex={setStepperIndex}
                  check={false} 
                  // Check to remove the Company Details from the Component shared by all
                /> : ""}

              </div>
            </div>

            <motion.img layout initial={{ y: 100 }} animate={{ y: 0 }} className={` absolute  hidden md:block   z-20 -right-[150px] -bottom-24 -z-10"`} src="/Images/Mask_Group.png" alt="" />

            <div className="mx-auto xs:justify-center   flex items-center h-[300px]  mt-5 sm:mt-0 ">
              <div className="">
                <div className="">
                  {stepperIndex == 0 ? <BasicDetails stepperIndex={stepperIndex} nextStep={nextStep} onChange={handleBasicDetailsChange} /> : ""}
                  {stepperIndex == 1 ? <TermsAndConditions stepperIndex={stepperIndex} data={formData.basicDetails} nextStep={nextStep} /> : ""}
                  {stepperIndex == 2 ? <Welcome data={formData} /> : ""}

                </div>
              </div>

            </div>

            {/* Example of controlling the stepper */}

          </div>
        </motion.div>
      </div>
    </>
  )
}


const BasicDetails = ({ nextStep, onChange }) => {
  const [data, setData] = useState({
    fullName: '',
    userName: '',
    gender: 'Male',
    age: '',
    category: '',
    photo: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError('');
    onChange(data);
  };

  const handleImageChange = (imageFile) => {
    setData((prevData) => ({
      ...prevData,
      photo: imageFile,
    }));
    setError('');
  };

  const isDataComplete = () => {
    return (
      data.fullName &&
      data.userName &&
      data.age &&
      data.gender &&
      data.category &&
      data.photo
    );
  };

  const handleNext = async () => {
    // Check for all required fields
    if (!data.fullName) {
      setError('Please enter your full name.');
    } else if (!data.userName) {
      setError('Please enter your user name.');
    } else if (!data.age) {
      setError('Please enter your age.');
    } else if (data.age < 18) {
      setError('Age must be 18 or older.');
    } else if (data.age <= 0) {
      setError('Age cannot be a negative value or zero.');
    } else if (!data.category) {
      setError('Please select a category.');
    } else if (!data.photo) {
      setError('Please upload an image.');
    } else {
      setError('');
      setLoading(true); // Set loading to true

      try {
        // Check if the userName already exists in the system
        const response = await axios.post(`${url}/SignUpCheck/check-InfluencerUserName`, { userName: data.userName });

        if (response.data.exists) {
          setError('This user name is already taken. Please choose a different name.');
        } else {
          setError('');
          onChange(data); // Pass the data to the parent component
          nextStep(); // Proceed to the next step
        }
      } catch (error) {
        console.error('Error checking user name:', error);
        setError('An error occurred while checking the user name. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after the request is done
      }
    }
  };

  return (
    <>
  
      <img className="hidden lg:flex w-96 absolute bottom-2 -left-0 h-[300px] z-20" src="/Svg/SignUp4.svg" alt="" />
      <div className="sm:items-start flex flex-col items-center justify-center">
        <div className="flex flex-col-reverse sm:items-center sm:flex-row justify-between">
          <div>
            <h5 className="poppins-regular mt-1">Full Name</h5>
            <input
              name="fullName"
              className="p-2 poppins-light InputBorder w-[200px] mdm:w-[200px] rounded-xl"
              onChange={handleChange}
              value={data.fullName}
            />
            <h5 className="poppins-regular mt-1">User Name</h5>
            <input
              name="userName"
              className="p-2 poppins-light InputBorder w-[200px] mdm:w-[250px] rounded-xl"
              onChange={handleChange}
              value={data.userName}
            />
          </div>
          <div className="mt-36 sm:mt-0">
            <PhotoUpload onImageChange={handleImageChange} />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 mt-3">
          <div>
            <h5 className="poppins-regular">Gender</h5>
            <select
              className="p-2 poppins-light InputBorder rounded-xl w-full"
              name="gender"
              onChange={handleChange}
              value={data.gender}
            >
              <option className="poppins-light" value="Male">Male</option>
              <option className="poppins-light" value="Female">Female</option>
              <option className="poppins-light" value="Other">Other</option>
            </select>
          </div>
          <div>
            <h5 className="poppins-regular">Enter Your Age</h5>
            <input
              name="age"
              type="number"
              min="18"
              className="p-2 poppins-light InputBorder w-full rounded-xl"
              onChange={handleChange}
              value={data.age}
            />
          </div>
        </div>

        <h5 className="poppins-regular mt-3 pb-1">Category</h5>
        <div className="flex flex-row mt-1 gap-2 flex-wrap justify-center">
          <RoundedBox
            value="Fashion"
            isSelected={data.category === 'Fashion'}
            onClick={() =>
              handleChange({
                target: { name: 'category', value: 'Fashion' },
              })
            }
          />
          <RoundedBox
            value="Travel"
            isSelected={data.category === 'Travel'}
            onClick={() =>
              handleChange({
                target: { name: 'category', value: 'Travel' },
              })
            }
          />
          <RoundedBox
            value="Media"
            isSelected={data.category === 'Media'}
            onClick={() =>
              handleChange({
                target: { name: 'category', value: 'Media' },
              })
            }
          />
          <RoundedBox
            value="Other"
            isSelected={data.category === 'Other'}
            onClick={() =>
              handleChange({
                target: { name: 'category', value: 'Other' },
              })
            }
          />
        </div>

        <div
          onClick={handleNext}
          className={`OrangeButtonWithText-v2 flex justify-center py-2 w-[100px] xs:w-[150px] mt-3 xs:mt-5 mx-auto ${!isDataComplete() ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
        >
          Next
        </div>
        {loading && (
      <Loader/>
    )}
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    </>
  );
};




const TermsAndConditions = ({ nextStep, data }) => {
  console.log(data);

  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;
  const userId =  Cookies.get('userId');

  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCheckboxChange = (e) => {
    setAccepted(e.target.checked);
  };

  const handleNext = async () => {
    if (accepted) {
      const formData = new FormData();
      formData.append('userId',userId)
      formData.append('fullName', data.fullName);
      // formData.append('userName', data.userName);
      formData.append('gender', data.gender);
      formData.append('age', data.age);
      formData.append('category', JSON.stringify([data.category]));
      formData.append('photo', data.photo); // Append the photo file
      const token = Cookies.get('token');
      try {
        // Replace with your API URL
        const response = await axios.post(`/api/influencerInfo`, formData, {
          
          withCredentials: true,
        });
  
        // Handle success response
        console.log(response.data);
        setMessage(response.data.message);
  
        // Only proceed to the next step if there was no error
        nextStep();
      } catch (error) {
        // Handle error response
        console.error(error);
        setError(error.response?.data?.message || "Something went wrong");
      }
    }
  };
  
  return (
    <>
      <img className="md:flex w-60 xs:w-96 h-[150px] xs:h-[250px] mt-3 z-20" src="/Svg/SignUp3.svg" alt="" />

      <div className="sm:w-[500px] flex mt-3">
        <input
          type="checkbox"
          checked={accepted}
          onChange={handleCheckboxChange}
          id="terms-checkbox"
        />
        <h1 className="ml-2">I confirm that I have read and accept the terms and conditions and privacy policy.</h1>
      </div>

      <div
        onClick={handleNext}
        className={`OrangeButtonWithText-v2 flex justify-center py-2 w-[100px] xs:w-[150px] mt-3 xs:mt-5 mx-auto ${!accepted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        style={{ pointerEvents: accepted ? 'auto' : 'none' }} // Ensure the button is not clickable when disabled
      >
        Next
      </div>
      {message && <p style={{ color: "black" }}>Account Created Successfully</p>}
      {error && <p style={{ color: "red" }}>Something Went wrong+{error}</p>}
    </>
  );
};




const Welcome = () => {

  const navigate = useNavigate();

  return (
    <>
      <div>

      </div>
      <h1 className="text-xl poppins-semibold text-center mb-5">Account successfully created!</h1>
      <img className="hidden md:flex w-96  h-[300px] z-20 " src="/Svg/Welcome.svg" alt="" />
      <div onClick={() => {
        const setCookieAndNavigate = async () => {
          // Set the cookie and wait for it to be set

          // Navigate to the home page after the cookie is set
          navigate('/');

        };
        setCookieAndNavigate();
      }} className="  OrangeButtonWithText-v2 flex justify-center  py-2  w-[150px]  mt-5 mx-auto  cursor-pointer ">
        <p >{"Get Started"}</p>
      </div>
    </>
  )
}

const RoundedBox = ({ value, isSelected, onClick }) => {
  return (
    <div
      onClick={() => onClick(value)}
      className={` z-20 InputBorder w-[40px] mdm:w-20 flex flex-row justify-center py-2 rounded-xl poppins-light ${isSelected ? 'bg-orange-500 text-white' : ''}`}
    >
      <p>{value}</p>
    </div>
  );
};

const PhotoUpload = ({ onImageChange }) => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      onImageChange(file); // Pass the file itself to the parent component
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`h-20 w-20 mx-auto sm:h-28 sm:w-28 rounded-full flex flex-col items-center justify-center cursor-pointer ${image ? '' : 'border-2'}`}
      onClick={handleDivClick}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <div className={`flex items-center justify-center ${!image ? "w-[50px]" : "w-[100px]"}`}>
        <img
          src={image || '/Svg/Upload.svg'}
          alt="Upload"
          className={`${!image ? "w-[25px] h-[25px]" : "w-[100px] h-[100px]"} Avatar rounded-full`}
        />
      </div>
      {!image && <p className="poppins-light ">Upload Photo</p>}
    </div>
  );
};

export default InfluencerSignUp