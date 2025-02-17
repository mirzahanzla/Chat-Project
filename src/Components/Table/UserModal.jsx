import { useState, useRef } from 'react';

const UserModal = ({ rowData, onClose }) => {
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


  // Function to toggle attachment modal
  const handleOpenAttachment = () => {
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
            <head><title>Transaction</title></head>
            <body style="margin:0;">
                <img src="${rowData.attachment}" style="width:100%;height:auto;" />
            </body>
        </html>
    `);
    newWindow.document.close();
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
            {(rowData.issue === 'Contract') &&
              <div className="flex justify-between lato-black text-[14px] poppins-regular items-center mt-5">


                <div className='w-full'>
                  <p className="poppins-semibold text-[14px] ">Contract Link</p>
                  <div className="flex items-center gap-x-2 mt-2 py-2">
                    <input
                      type="text"
                      readOnly
                      className="border-[1px] rounded-3xl outline-none font-normal w-full px-3 pr-10 py-[6px] text-black/50"
                      ref={contractLinkRef}
                      value={rowData.contractLink}
                    />
                    <div
                      className="OrangeButtonWithText-v4 w-[50px] py-[7px] text-[12px] flex items-center cursor-pointer"
                      onClick={handleOpenContractLink}
                    >
                      <p>Open</p>
                    </div>
                  </div>
                </div>


              </div>
            }

            <div className="text-[14px] mt-5">
              <p className="poppins-semibold text-[14px] ">Description</p>
              <div className="DealsBorder-v2 mt-2">
                <p className="font-medium text-black/50 py-2 text-center">
                  {rowData.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex  w-full mt-5 justify-between items-center text-[14px] poppins-regular">


            {/* Status Dropdown */}
            <div >
              <p className="poppins-semibold text-[14px] ">
                Status
              </p>
              <div className="border-[1px] rounded-lg px-3 py-2 w-[150px] text-black/50 font-medium">
                <p>{rowData.status.name}</p>
              </div>
            </div>

            {/* Open Attachment */}


            {rowData.attachment ? <div className="flex justify-between items-center  my-3 text-[9px] sm:text-[10px] mdm:text-[12px]">




              <div className="flex justify-end h-[34px] space-x-3 ">
                <div
                  className="OrangeButtonWithText-v4 flex items-center cursor-pointer"
                  onClick={handleOpenAttachment}
                >
                  <p>Open Attachment</p>
                </div>
              </div>
            </div> : ""}


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

export default UserModal;
