import { useState } from "react";


const STATUS_COLORS = {
  'Resolved': 'green',
  'Pending': 'yellow',
  'In Review': 'orange',
  'Closed': 'purple',
  'Deployed': 'green',
  // Add more status-to-color mappings as needed
};
// Resolved

const BORDER_COLORS = {
  'Pending': '  border-[#FB773F] text-orange-500 ',
  'Resolved': 'text-green-500 border-[#1ce14a]  ',
  'Rejected': ' text-black/70 border-[#00000070]',
  'Payment Processing': ' border-[#FB773F] text-orange-500',
  'pending': '  border-[#FB773F] text-orange-500 ',
  'approved': 'text-green-500 border-[#1ce14a]  ',


};

export const ColorIcon = ({ color, ...props }) => (
  <div
    className={`w-[12px] h-[12px] rounded-[3px] `}
  // style={{ backgroundColor: color }}
  />
);

const StatusCell = ({ getValue, row, column, table }) => {
  console.log("Value of status is")
  console.log(getValue())

  // const { status } =  || {};

  const [isOpen, setIsOpen] = useState(false);

  // Determine the background color based on status name
  // ColorBorder, Status, TextColor

  return (
    <div className="relative poppins-regular">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full text-left p-1.5  text-black ${BORDER_COLORS[name]}`}>
        <div className="w-[40px]  sm:w-[70px] mdm:w-[120px] text-center col-span-2 ">
          <p className={`   ${BORDER_COLORS[getValue().name]}  cursor-pointer  xs:border-[1px]    rounded-2xl px-3 py-2  `}  > {getValue().name}</p>
        </div>

      </div>




    </div>
  );
};

export default StatusCell;
