import { useState, useRef } from 'react';

const UserContactUs = ({ rowData, onClose }) => {
  const contractLinkRef = useRef(null);
  console.log("id is ")
  console.log(rowData)

  if (!rowData) return null;

  // Function to open the contract link in a new tab
  const handleOpenContractLink = () => {
    const link = contractLinkRef.current.value;
    if (link) {
      window.open(link, '_blank');
    } else {
      alert("Contract link is empty!");
    }
  };

  return (

    <>


      <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10`} >
        <div className="bg-white p-4 rounded-lg w-[300px] md:w-[500px]">
          <img
            src="/Svg/Close.svg"
            alt=""
            className="cursor-pointer ml-auto size-[20px]"
            onClick={onClose}
          />


          <div >
            

            <div className="text-[14px] mt-5">
              <p className="poppins-semibold text-[14px] ">Message</p>
              <div className="DealsBorder-v2 mt-2">
                <p className="font-medium text-black/50 py-2 text-center">
                  {rowData.message}
                </p>
              </div>
            </div>
          </div>


          {/* Send Button */}
          <div onClick={onClose} className="mt-5 flex">
            <button className="OrangeButtonWithText-v4 py-2 px-10 text-[14px] rounded-lg w-full">
              Close
            </button>
          </div>

        </div>
      </div>


    </>
  );
};

export default UserContactUs;
