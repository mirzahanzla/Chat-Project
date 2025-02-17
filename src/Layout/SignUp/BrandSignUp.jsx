import { useState, useEffect, useRef } from 'react';
import Logo from '../../Components/Logo/Logo';
import { motion, MotionConfig } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './index.css';
import NavBar from './NavBar';
import Cookies from 'js-cookie';
import axios from "axios";
import Loader from '../../Components/Loaders/Loaders';


const BrandSignUp = () => {
  const [stepperIndex, setStepperIndex] = useState(0);

  const [formData, setFormData] = useState({
    basicDetails: {},
    companyDetails: {},
    termsAccepted: false,
  });


  const handleBasicDetailsChange = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      basicDetails: data,
    }));
  };

  const handleCompanyDetailsChange = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      companyDetails: data,
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

  return (
    <div className=' w-full h-screen items-center  sm:h-[550px] lg:h-screen flex text-10px bgSignUp text-[12px] '>

      {/* Middle Container */}
      <motion.div layout className={`${stepperIndex < 3 ? "xs:w-10/12" : 'xs:w-11/12'} mx-auto  BarColor my-10 h-full xs:h-[450px] sm:h-[520px]    xs:rounded-3xl  overflow-hidden  relative  `}>

        <div className="flex flex-col mx-2 xs:mx-5 md:mx-10    pt-2">

          <div className="flex justify-between  items-center" >
            <img className="bg-transparent w-44 xs:w-40 md:w-44 lg:w-56 " src="/Logo/LogoText.jpg" alt="" />
            <h1 className=" BlackButtonWithText-v1 hidden sm:flex poppins-semibold border-2 text-center text-white rounded-xl bg-black h-[34px]    items-center  text-[7px]  sm:text-[10px] px-4    " > Home</h1>
          </div>
          <div className="w-[290px] md:w-[700px] mt-10 mx-auto xs:flex justify-between items-center">

            {/* Back Button */}
            {stepperIndex > 0 && stepperIndex < 3 ? <img className="cursor-pointer w-[15px] h-[15px] sm:w-[20px] sm:h-[20px]  mb-3 xs:mb-0" onClick={prevStep} src="/Svg/BackButton.svg" /> : ""}

            <div className="w-[190px] mx-auto xs:flex-grow ">
              {stepperIndex < 3 ? <NavBar
                stepperIndex={stepperIndex}
                nextStep={nextStep}
                prevStep={prevStep}
                setStepperIndex={setStepperIndex}
              /> : ""}
            </div>

          </div>

          <motion.img layout initial={{ y: 100 }} animate={{ y: 0 }} className={` absolute  hidden md:block  -bottom-28  z-20 ${stepperIndex == 0 ? " -left-[250px] lg:-left-[200px] " : "-right-[150px] -bottom-2 -z-10"}`} src="/Images/Mask_Group.png" alt="" />

          <div className="mx-auto xs:justify-center   flex items-center h-[300px]  ">
            <div className="">
              <div className="">
                {stepperIndex == 0 ? <BasicDetails stepperIndex={stepperIndex} nextStep={nextStep} onChange={handleBasicDetailsChange} /> : ""}
                {stepperIndex == 1 ? <CompanyDetails stepperIndex={stepperIndex} nextStep={nextStep} onChange={handleCompanyDetailsChange} /> : ""}
                {stepperIndex == 2 ? <TermsAndConditions stepperIndex={stepperIndex} nextStep={nextStep} data={formData} /> : ""}
                {stepperIndex == 3 ? <Welcome data={formData} /> : ""}


              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  )
}


const BasicDetails = ({ nextStep, onChange }) => {
  const [data, setData] = useState({
    position: '',
    companySize: '0',
    influencerSize: '50+',
  });
  const [error, setError] = useState(''); // State for managing error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(''); // Clear error message when user corrects the input
    onChange(data); // Pass updated data to parent component
  };

  const handleNext = () => {
    let missingFields = [];

    if (!data.position) {
      missingFields.push('Position');
    }
    if (!data.companySize) {
      missingFields.push('Company Size');
    }
    if (!data.influencerSize) {
      missingFields.push('Influencer Size');
    }

    if (missingFields.length > 0) {
      setError(`Please fill in the following field: ${missingFields.join(', ')}`);
    } else {
      setError(''); // Clear error if everything is filled
      onChange(data);
      nextStep();
    }
  };

  const CompanySizeClick = (value) => {
    setData((prevData) => ({
      ...prevData,
      companySize: value,
    }));
    setError(''); // Clear error message when user corrects the input
  };

  const InfluencerSizeClick = (value) => {
    setData((prevData) => ({
      ...prevData,
      influencerSize: value,
    }));
    setError(''); // Clear error message when user corrects the input
  };

  return (
    <>
      <div className="text-[8px] sm:text-[7px] mdm:text-[10px]">
        <h5 className="poppins-regular mt-3 pb-1">Which describes your position?</h5>
        <select
          name="position"
          onChange={handleChange}
          className="p-2 poppins-light InputBorder rounded-xl w-[200px] xs:w-full"
        >
          <option className="poppins-light" value="">
            Select Position
          </option>
          <option className="poppins-light" value="Sales">
            Sales
          </option>
          <option className="poppins-light" value="Manager">
            Manager
          </option>
          <option className="poppins-light" value="Other">
            Other
          </option>
        </select>
        <img className="hidden md:flex w-96 absolute -bottom-2 -right-10 z-20" src="/Svg/SignUp1.svg" alt="" />


        <h5 className="poppins-regular mt-2 mdm:mt-5">How big is your Company?</h5>
        <div className="flex flex-row mt-3 gap-2 w-[200px] xs:w-full">
          <RoundedBox value="0" isSelected={data.companySize === "0"} onClick={CompanySizeClick} />
          <RoundedBox value="1-10" isSelected={data.companySize === "1-10"} onClick={CompanySizeClick} />
          <RoundedBox value="11-50" isSelected={data.companySize === "11-50"} onClick={CompanySizeClick} />
          <RoundedBox value="50+" isSelected={data.companySize === "50+"} onClick={CompanySizeClick} />
        </div>

        <h5 className="poppins-regular mt-5">How many Influencers did you work with last month?</h5>
        <div className="flex flex-row mt-3 gap-2 w-[200px] xs:w-full">
          <RoundedBox value="0" isSelected={data.influencerSize === "0"} onClick={InfluencerSizeClick} />
          <RoundedBox value="1-10" isSelected={data.influencerSize === "1-10"} onClick={InfluencerSizeClick} />
          <RoundedBox value="11-50" isSelected={data.influencerSize === "11-50"} onClick={InfluencerSizeClick} />
          <RoundedBox value="50+" isSelected={data.influencerSize === "50+"} onClick={InfluencerSizeClick} />
        </div>

        {/* Error message div */}
        {error && (
          <div className="text-red-500 text-center mt-3">
            {error}
          </div>
        )}

        <div
          onClick={handleNext}
          className="OrangeButtonWithText-v2 flex justify-center py-2 w-[100px] xs:w-[150px] mt-3 xs:mt-5 mx-auto cursor-pointer"
        >
          Next
        </div>
      </div>
    </>
  );
};





const CompanyDetails = ({ nextStep, onChange }) => {
  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;

  const [data, setData] = useState({
    brandName: '',
    brandUserName: '',
    websiteLink: '',
    category: 'Fashion',
    photo: null,
  });
  // State to hold the image URL
  const [error, setError] = useState(''); // State for managing error message

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(''); // Clear error message when user corrects the input
    onChange(data); // Pass updated data to parent component
  };

  const handleCategoryClick = (value) => {
    setData((prevData) => ({
      ...prevData,
      category: value,
    }));
    setError(''); // Clear error message when user corrects the input
  };

  const handleImageChange = (imageFile) => {
    setData((prevData) => ({
      ...prevData,
      photo: imageFile,
    }));
    setError(''); // Clear error message when user uploads the image
  };

  const handleNext = async () => {

    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;


    // if (data.brandName && data.websiteLink && data.category && data.photo && data.brandUserName) {
    //   if (!urlPattern.test(data.websiteLink)) {
    //     setError('Please enter a valid website link (e.g., https://example.com).');
    //     return;
    //   }
    // Check if all the values are added (no value is null or empty) and image is uploaded /api/users/brand/check-brand
    if (data.brandName && data.websiteLink && data.category && data.photo && data.brandUserName) {
     console.log("Before next brandUSername is")
     console.log(data.brandUserName)
          if (!urlPattern.test(data.websiteLink)) {
        setError('Please enter a valid website link (e.g., https://example.com).');
        return;
          }
      try {
        // Make an Axios request to check if the brand name exists
        const response = await axios.post(`${url}/SignUpCheck/check-brandName`, { brandName: data.brandName });
        const response2 = await axios.post(`${url}/SignUpCheck/check-brandUsername`, { brandUserName: data.brandUserName });

        // Assume the backend returns { exists: true } if the brand exists
        console.log(response.data);
        if (response.data.exists) {
          setError('This brand name is already taken. Please choose a different name.');
        } else if( response2.data.exists){
          setError('This user name is already taken. Please choose a different name.');

        }
        
        else  {
          // If the brand name is not taken, proceed with the next step
          setError(''); // Clear error if everything is valid
          onChange(data);
          nextStep(); // Proceed to the next step
        }
      } catch (error) {
        console.error('Error checking brand name:', error);
        setError('An error occurred while checking the brand name. Please try again.');
      }
    } else {
      setError('Please fill in all the fields and upload a photo before proceeding.');
    }
  };

  return (
    <>
      <img className="hidden lg:flex w-96 absolute bottom-2 -left-10 h-[300px] z-20" src="/Svg/SignUp4.svg" alt="" />
      <div className="w-[200px] mdm:w-[500px] text-[8px] sm:text-[7px] mdm:text-[10px]">
        <div className="flex-col-reverse mdm:flex-row-reverse flex flex-row justify-between">
          <div>
            <h5 className="poppins-regular mt-1">Brand Name</h5>
            <input
              name="brandName"
              value={data.brandName}
              onChange={handleInputChange}
              className="p-2 poppins-light InputBorder w-[150px] mdm:w-[250px] rounded-xl"
            />
            <h5 className="poppins-regular mt-1">User Name</h5>
            <input
              name="brandUserName"
              value={data.brandUserName}
              onChange={handleInputChange}
              className="p-2 poppins-light InputBorder w-[150px] mdm:w-[250px] rounded-xl"
            />

            <h5 className="poppins-regular mt-1 pb-1">Website Link</h5>
            <input
              name="websiteLink"
              value={data.websiteLink}
              onChange={handleInputChange}
              className="p-2 poppins-light InputBorder w-[200px] mdm:w-[350px] rounded-xl"
            />
          </div>

          {/* Pass setImage function to PhotoUpload */}
          <PhotoUpload onImageChange={handleImageChange} />
        </div>

        <div className="w-[400px] mx-auto mt-3">
          <h5 className="poppins-regular sm:mt-3 pb-1 mx-auto">Category</h5>
          <div className="flex flex-row mt-1 gap-2 z-10">
            <RoundedBox value="Fashion" isSelected={data.category === "Fashion"} onClick={handleCategoryClick} />
            <RoundedBox value="Travel" isSelected={data.category === "Travel"} onClick={handleCategoryClick} />
            <RoundedBox value="Media" isSelected={data.category === "Media"} onClick={handleCategoryClick} />
            <RoundedBox value="Other" isSelected={data.category === "Other"} onClick={handleCategoryClick} />
          </div>
        </div>

        {/* Error message div */}
        {error && (
          <div className="text-red-500 text-center mt-3">
            {error}
          </div>
        )}

        <div
          onClick={handleNext}
          className="OrangeButtonWithText-v2 flex justify-center py-2 w-[100px] xs:w-[150px] mt-3 xs:mt-5 mx-auto cursor-pointer"
        >
          Next
        </div>
      </div>
    </>
  );
};

const TermsAndConditions = ({ nextStep, data }) => {
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // New loading state
  const userId = Cookies.get('userId');

  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;

  const handleCheckboxChange = (e) => {
    setAccepted(e.target.checked);
  };

  const handleNext = async () => {
    if (accepted) {
      console.log("userName is ")
      console.log(data.companyDetails.brandUserName)
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('brandUserName', data.companyDetails.brandUserName);
      formData.append('position', data.basicDetails.position);
      formData.append('companySize', data.basicDetails.companySize);
      formData.append('influencersWorkedWith', data.basicDetails.influencerSize);
      formData.append('brandName', data.companyDetails.brandName);
      formData.append('website', data.companyDetails.websiteLink);
      formData.append('category', data.companyDetails.category);
      formData.append('logo', data.companyDetails.photo); // Append the File object


      // Set loading state to true while making the request
      setIsLoading(true);
      console.log("Form data is ")
      console.log(formData)

      try {
        const response = await fetch('/api/Brand', {
          method: 'POST',
          body: formData,
          credentials: 'include', // Include credentials (cookies) in the request
        });

        if (!response.ok) {
          // Handle non-200 responses
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        }

        const data = await response.json();
        // Handle success response
        console.log(data);
        setMessage(data.message);

        // Only proceed to the next step if there was no error
        nextStep();
      } catch (error) {
        // Handle error response
        console.error(error);
        setError(error.message);
      } finally {
        // Set loading state to false after the request completes (success or failure)
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <img
        className="md:flex w-52 xs:w-96 h-[150px] xs:h-[250px] mt-10 z-20"
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

      {message && <p style={{ color: 'black' }}>Account Created Successfully</p>}
      {error && <p style={{ color: 'red' }}>Something went wrong: {error}</p>}
    </>
  );
};


const Welcome = ({ data }) => {

  console.log("last result is");
  console.log({ ...data });
  const navigate = useNavigate();

  return (
    <>

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
      onImageChange(file); // Pass the File object to the parent component
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`h-20 w-20 mx-auto p-1 sm:h-28 sm:w-28 rounded-full flex flex-col items-center justify-center cursor-pointer ${image ? '' : 'border-2'} z-20`}
      onClick={handleDivClick}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <div className={`flex justify-center ${!image ? "w-[50px]" : "w-[100px]"}`}>
        <img
          src={image || '/Svg/Upload.svg'}
          alt="Upload"
          className={`${!image ? "w-[25px] h-[25px]" : "w-[100px] h-[100px]"} Avatar rounded-full`}
        />
      </div>
      {!image && <p className="poppins-light">Upload Photo</p>}
    </div>
  );
};

export default BrandSignUp