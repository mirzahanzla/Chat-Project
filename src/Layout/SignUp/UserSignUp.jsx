import { motion,  } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './index.css';
import NavBar from './NavBar';
import Cookies from 'js-cookie';
import axios from "axios";
import { useState,  useRef } from 'react';
import Loader from '../../Components/Loaders/Loaders';

const UserSignUp = () => {
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
    photo: null, // Store the file itself, not just the URL
  });
  const [error, setError] = useState(''); // State for managing error messages
  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(''); // Clear error message when user corrects the input
    onChange(data); // Pass updated data to parent component
  };

  const handleImageChange = (imageFile) => {
    setData((prevData) => ({
      ...prevData,
      photo: imageFile,
    }));
    setError(''); // Clear error message when user uploads the image
  };

  const isDataComplete = () => {
    // Check if all required fields are filled
    return (
      data.fullName &&
      data.userName &&
      data.age &&
      data.gender &&
      data.photo
    );
  };

  const handleNext = async () => {
    // Validate each field
    if (!data.fullName) {
      setError('Please enter your full name.');
    } else if (!data.userName) {
      setError('Please enter your user name.');
    } else if (!data.age || data.age < 18) {
      setError('Please enter a valid age (18 or older).');
    } else if (!data.photo) {
      setError('Please upload an image.');
    } else {
      setError(''); // Clear error if everything is filled

      try {
        // Make an Axios request to check if the username exists
        const response = await axios.post(`${url}/SignUpCheck/check-UserName`, { userName: data.userName });

        console.log("in Company details  response is ");
        console.log(response.data.exists);

        if (response.data.exists) {
          setError('This User name is already taken. Please choose a different name.');
        } else {
          // If the username is not taken, proceed to the next step
          setError(''); // Clear error if everything is valid
          onChange(data);
          nextStep(); // Proceed to the next step
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setError('An error occurred while checking the User name. Please try again.');
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
          <div className=" sm:mt-0">
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

        <div
          onClick={handleNext}
          className={`OrangeButtonWithText-v2 flex justify-center py-2 w-[100px] xs:w-[150px] mt-3 xs:mt-5 mx-auto ${!isDataComplete() ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
        >
          Next
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    </>
  );
};



const TermsAndConditions = ({ nextStep, data }) => {
  console.log(data);

  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;

  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // New loading state

  const handleCheckboxChange = (e) => {
    setAccepted(e.target.checked);
  };

  const handleNext = async () => {
    const userId = Cookies.get('userId');
    if (accepted) {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('fullName', data.fullName);
      formData.append('gender', data.gender);
      formData.append('age', data.age);
      formData.append('category', data.category);
      formData.append('photo', data.photo); // Append the photo file

      const token = Cookies.get('token');

      // Set loading state to true while making the request
      setIsLoading(true);

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
      } finally {
        // Set loading state to false after the request completes (success or failure)
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <img
        className="md:flex w-60 xs:w-96 h-[150px] xs:h-[250px] mt-3 z-20"
        src="/Svg/SignUp3.svg"
        alt=""
      />

      <div className="sm:w-[500px] flex mt-3">
        <input
          type="checkbox"
          checked={accepted}
          onChange={handleCheckboxChange}
          id="terms-checkbox"
        />
        <h1 className="ml-2">
          I confirm that I have read and accept the terms and conditions and privacy policy.
        </h1>
      </div>

      <div
        onClick={handleNext}
        className={`OrangeButtonWithText-v2 flex justify-center py-2 w-[100px] xs:w-[150px] mt-3 xs:mt-5 mx-auto ${
          !accepted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        style={{ pointerEvents: accepted ? 'auto' : 'none' }} // Ensure the button is not clickable when disabled
      >
        Next
      </div>

      {isLoading && (
       <Loader/>
      )}

      {message && <p style={{ color: "black" }}>Account Created Successfully</p>}
      {error && <p style={{ color: "red" }}>Something went wrong: {error}</p>}
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
          navigate('/Dashboard');

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

export default UserSignUp