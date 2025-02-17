import React from 'react';

const UploadDraft = ({ disabled, onClick }) => {
  // Define styles for disabled state
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <div
      className={`text-[10px] lg:text-[12px] w-[250px] h-[270px] mdm:w-[250px] mdm:h-[270px] bg-white rounded-2xl OverViewBox1 flex justify-center items-center ${disabledStyles}`}
      onClick={() => !disabled && onClick()} // Call onClick only if not disabled
    >
      <div className="rounded-xl overflow-hidden poppins-semibold flex justify-center items-center">
        + Upload Draft
      </div>
    </div>
  );
};

export default UploadDraft;