import React, { useState } from 'react';
import TransferPaymentModal from './TransferPaymentModal';
import IssueMedia from './IssueMedia';

const Contract = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open/close the modal
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    
  };
   const sender = "Influencer Name"
  const receiver = "Brand Name"

  return (
    <>
      <div className='pt-10'>
        <div className='mx-10 bg-white p-5 rounded-2xl'>
          <img
            src="/Svg/Close.svg"
            alt="Close"
            className="cursor-pointer ml-auto size-[30px]"
          />
          
          <div className='flex flex-col lg:flex-row justify-between items-center'>
            {/* Left Side */}
            <div className='w-full mx-5'>
              <div className="text-[14px]">
                <p className="poppins-semibold text-[13px]">Problem Description</p>
                <div className="DealsBorder-v2 mt-2">
                  <p className="font-medium text-black/50 poppins-semibold text-[13px] py-2 text-center">
                    I have made the post as described by the Brand but haven't received the payment yet.
                  </p>
                </div>
              </div>

              {/* Message Input and Status */}
              <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start text-[14px] poppins-regular">
                <div className="mx-5 mt-5 w-full">
                  <p className="poppins-semibold text-[13px] text-center">
                    Message
                  </p>
                  <textarea
                    className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50 mt-2"
                    rows="4"
                    placeholder="Write something..."
                  ></textarea>
                </div>
                
                <div className="mt-5">
                  <p className="poppins-semibold text-[13px] text-center mt-2">Status</p>
                  <select className="border-[1px] rounded-lg px-3 py-2 w-[150px] text-black/50 font-medium mt-2">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Send Message Button */}
              <div className="mt-5 flex">
                <button className="OrangeButtonWithText-v4 py-2 px-10 text-[14px] rounded-lg w-[150px] ml-auto">
                  Send Message
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className='w-full'>
              <div className="xs:[w-300px] md:w-[400px] mx-auto rounded-3xl">
                <div className='w-full'>
                  <div className="flex justify-between text-[9px] sm:text-[10px] mdm:text-[10px] items-center mx-10">
                    <p className="poppins-semibold text-[13px]">Planned</p>
                  </div>
                  <div className="border-2 lg:mx-10 mt-1 p-5 text-[9px] sm:text-[10px] mdm:text-[12px] rounded-xl w-full">
                    <div className="flex flex-col gap-y-2">
                      <div className="flex justify-between">
                        <p className="poppins-semibold">Task</p>
                        <p className="text-black/50 lato-regular">2 posts</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="poppins-semibold">Deadline</p>
                        <p className="text-black/50 lato-regular">29 Dec, 2023</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="poppins-semibold">Draft Submission</p>
                        <p className="text-black/50 lato-regular">2 days before</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="flex justify-between text-[9px] sm:text-[10px] mdm:text-[10px] items-center mt-2 mx-10">
                    <p className="poppins-semibold text-[13px]">Payment</p>
                  </div>

                  <div className="border-2 lg:mx-10 mt-1 p-5 text-[9px] sm:text-[10px] mdm:text-[12px] rounded-xl w-full">
                    <div className="flex flex-col gap-y-2">
                      <div className="flex justify-between">
                        <p className="poppins-semibold">Payment term</p>
                        <p className="text-black/50 lato-regular">50% before and after</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="poppins-semibold">Budget</p>
                        <p className="text-black/50 lato-regular">$600</p>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Payment Button */}
                  <div className="mt-5 flex">
                    <button
                      className="OrangeButtonWithText-v4 py-2 px-10 text-[14px] rounded-lg w-[150px] ml-auto"
                      onClick={handleModalToggle}
                    >
                      Transfer Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Transfer Payment */}
        <TransferPaymentModal isOpen={isModalOpen} onClose={handleModalToggle} sender={sender}
        receiver={receiver} />
      </div>

      <IssueMedia />
    </>
  );
};

export default Contract;
