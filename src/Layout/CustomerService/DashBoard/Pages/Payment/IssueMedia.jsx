import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion';
import { DropdownSvg } from '../../../../../Components/Svg/DropDownSvg';

const IssueMedia = () => {
  const navItems = ['New Post', 'Instruction', 'Approved', 'Payment'];

  return (
    <>
      {/* Wrapper */}
      <div className="mx-2 xs:ml-10 pt-5 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[10px]">

      

        <div className="flex justify-start mt-2 ml-10 gap-x-3  ">
          <Dropdown key={1} items={navItems} initialValue="All" />
        </div>

        <Media />


      </div>

    </>
  )
}






const Media = () => {

  // 0 Draft Waiting =  OrangeColor 
  //  1 Draft Approval =  Green Color
  //  2 Payment =       LightPurishColor
  //  3 Edit Instruction= BlueColor
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const mediaData = [
    {
      PostImageSrc: "/Media/p6.jpg",
      Instruction: "Draft (awaiting approval)",
      Type: 0,
      Time: "1 sec ago",
      Bio: "The color of seasosn @season..."

    },
    {
      PostImageSrc: "/Media/p7.jpg",
      Instruction: "Draft approval",
      Type: 1,
      Time: "1 sec ago",
      Bio: "The color of seasosn @season..."

    },
    {
      PostImageSrc: "/Media/p12.jpg",
      Instruction: " Payment done  $30",
      Type: 2,
      Time: "1 sec ago",
      Bio: "The color of seasosn @season..."

    },
    {
      PostImageSrc: "/Media/p1.jpg",
      Instruction: " Edit instruction",
      Type: 3,
      Time: "1 sec ago",
      Bio: "The color of seasosn @season..."

    }
  ];

  return (
    <>
    <DraftUploadModal isOpen={isModalOpen} onClose={closeModal} />
    <div className=" w-full mt-5  pb-10 ">
      <div className="px-5  flex flex-col">
        <div className=" poppins-regular text-[10px] md:text-base">
          <div className="mt-2 grid xs:grid-cols-2   md:grid-cols-4  gap-y-4">
            
            {mediaData.map((media, index) => (

              <ProfileMedia
                key={index}
                PostImageSrc={media.PostImageSrc}
                Instruction={media.Instruction}
                Type={media.Type}
                Time={media.Time}
                Bio={media.Bio}
              />

            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
    
}



const ProfileMedia = ({ PostImageSrc, Instruction, Type, Time, Bio }) => {

  let Color = ['OrangeColor', 'GreenColor', 'LightPurishColor', 'BlueColor'];

  return (
    <>

      <div className=" text-[10px] lg:text-[12px] w-[250px] h-[270px] mdm:w-[250px] mdm:h-[270px] bg-white rounded-2xl flex flex-col  OverViewBox1 justify-self-center ">
        <div className="w-[250px]   rounded-xl overflow-hidden ">

          <div className="h-[200px] rounded-lg flex items-center   ">
            <img className="aspect-square  ProfileMedia" src={PostImageSrc} alt="" />
          </div>


        </div>
        {/* wrapper */}
        <div className="ml-2 mt-2     text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] flex  flex-col justify-around" >
          <div className={`${Color[Type]} poppins-bold`}><p>{Instruction}</p></div>
          <p className="poppins-bold">{Time}</p>

          <p className="text-black/50 poppins-semibold pb-2">{Bio}</p>
        </div>
      </div>

    </>
  )
}



const UploadDraft = () => {

  return (
    <>
      <div className=" text-[10px] lg:text-[12px] w-[250px] h-[270px] mdm:w-[250px] mdm:h-[270px] bg-white rounded-2xl  OverViewBox1 flex justify-center items-center cursor-pointer justify-self-center">
        <div className="   rounded-xl overflow-hidden  poppins-semibold flex justify-center items-center ">
          + Upload Darft
        </div>
      </div>
    </>
  )

}

const Dropdown = ({ items, initialValue }) => {
  const [isOpen, setIsOpen] = useState([0, initialValue]);

  return (
    <div className="flex items-center flex-col poppins-semibold rounded-xl bg-white relative  text-[9px] xs:text-[10px] sm:text-[13px] md:text-[12px]">
      <div
        className=" px-2 py-1 sm:p-2 flex justify-between w-[100px] sm:w-[120px]   items-center relative "
        onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}>
        <div>{isOpen[1]}</div>
        <DropdownSvg />
      </div>
      {isOpen[0] ? (
        <ul className="poppins-regular flex gap-y-2 flex-col mt-2 absolute top-10 bg-white w-full p-2 rounded-xl">
          {items.map((item, index) =>
            isOpen[1] !== item ? (
              <li key={index} className="dropdown-item" onClick={() => setIsOpen([0, item])}>
                {item}
              </li>
            ) : null
          )}
        </ul>
      ) : ""}
    </div>
  );
};


const DraftUploadModal = ({ isOpen, onClose }) => {
  const navItems = ['Post',  'Video'];
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? '' : 'hidden'} z-30`}>
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <div className="flex justify-end mr-4 h-[20px] cursor-pointer" onClick={onClose} ><img src="/Svg/Close.svg" alt="" /></div>
        <h2 className="text-2xl font-bold mb-4">Upload a draft for review</h2>
        <p className="text-gray-600 mb-6">
          The organizer will then be notified about your Submitted draft. Do not make a post before receiving approval.
        </p>
        <div className="flex w-[200px] sm:w-[300px]   mx-auto  sm:ml-10 mb-5">
          <NavBarItems items={navItems}  />
        </div>
        <div className="border-dashed border-2 border-gray-300 rounded-lg h-32 flex items-center justify-center mb-4 text-gray-400 text-center flex-col">
          <p>+</p>
          <p className="">Upload Content<br/>Supported format: .jpg, .mp4</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="w-full border rounded-lg p-2"
            rows="4"
            placeholder="Add post text here..."
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-orange-500 text-white px-6 py-2 rounded-full focus:outline-none hover:bg-orange-600">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};


const NavBarItems = ({ items }) => {
  const [isHover, setIsHover] = useState(-1);
  const [isActive, setIsActive] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          className="poppins-semibold relative  z-50 w-full text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] text-center px-2 py-2 sm:py-2 cursor-pointer  list-none"
          onMouseEnter={() => setIsHover(index)}
          onMouseLeave={() => setIsHover(-1)}
          onClick={() => {
            setIsActive(index);
          
          }}
        >
          <li className={`${ isHover === index ? 'text-primary' : ''} ${isActive === index ?'text-white':""}  `}>
            <p>{item}</p>
            {isActive === index && (
              <motion.div layoutId="Deals" className="absolute w-full bg-black h-full top-0 left-0 p-2 rounded-xl -z-10"></motion.div>
            )}
          </li>
        </div>
      ))}
    </>
  );
};



export default IssueMedia