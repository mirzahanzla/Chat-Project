import React from 'react';

const TransferPaymentModal = ({ isOpen, onClose ,sender, receiver, onSubmit}) => {
  if (!isOpen) return null; // Return null if the modal is closed

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg w-[300px] sm:w-[400px]">
        <img
          src="/Svg/Close.svg"
          alt="Close"
          className="cursor-pointer ml-auto size-[20px]"
          onClick={onClose}
        />
        
        <h2 className="text-center text-lg poppins-semibold mb-4">Transfer Payment</h2>
        
        <div className="flex flex-col gap-4">


          <div className='flex justify-between gap-x-5'>
          <div>
            <label className="block text-sm poppins-regular mb-1">From</label>
            <input
            readOnly
              type="text"
              className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50"
              value={sender}
              placeholder="Enter sender's account"
            />
          </div>
          
          <div>
            <label className="block text-sm poppins-regular mb-1">To</label>
            <input
            readOnly
              type="text"
              value={receiver}
              className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50"
              placeholder="Enter receiver's account"
            />
          </div>
          </div>
          
          <div>
            <label className="block text-sm poppins-regular mb-1">Amount</label>
            <input
              type="number"
              className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50"
              placeholder="Enter amount"
            />
          </div>
          
          <button className="OrangeButtonWithText-v4 py-2 px-10 text-[14px] rounded-lg w-full mt-4">
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferPaymentModal;
