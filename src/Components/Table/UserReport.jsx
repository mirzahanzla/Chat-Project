import { useEffect, useState } from "react";

const UserReport = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  console.log(initialValue)
  return (
    <div className=' flex  my-3 text-[9px] sm:text-[10px] mdm:text-[12px] w-[150px] '>

    <div className=' flex flex-1 flex-col  ml-2'>
      <div className='flex text-center'>
        <p className='poppins-regular w-full text-center'>{initialValue}</p>
      </div>
     
    </div>
  </div>
  );
};

export default UserReport;
