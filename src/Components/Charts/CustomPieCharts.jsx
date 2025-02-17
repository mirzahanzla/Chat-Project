import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useFetch from '../../Hooks/useFetch';
import { calcLength } from 'framer-motion';

// Sample Data


// Define specific colors for each category
const COLORS = {
  Contract: '#7459D9', // Indigo
  Payment: '#927EDF',  // Green
  Account: '#A8DBFA',  // Orange
  Others: '#C0DBD0',   // Red
};

const CustomPieChart = ({data1}) => {

  


  // Calculate total users

  const data = [
    { name: 'Contract', value: parseInt(data1.Contract||0) },
    { name: 'Payment', value: parseInt(data1.Payment||0)},
    { name: 'Account', value:parseInt(data1.Account ||0)},
    { name: 'Others', value: parseInt(data1.Others||0)},
  ];



  const totalUsers = data.reduce((acc, item) => acc + item.value, 0);


  return (
 <>
<div className=' text-base font-semibold'>
<h1>Total Queries</h1>
 <div className="flex flex-row items-center space-y-4 gap-12 poppins-regular ">
   
   {/* Pie Chart with Total Queries in the center */}
   <div className="relative w-56 h-56 "> {/* Adjust the width and height to 100px (24 Tailwind units) */}
     <ResponsiveContainer>
       <PieChart>
         <Pie
           data={data}
           cx="50%"
           cy="50%"
           innerRadius={80}  // Smaller inner radius
           outerRadius={105}  // Smaller outer radius
           fill="#8884d8"
           paddingAngle={5}
           dataKey="value"
         >
           {data.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
           ))}
         </Pie>
       </PieChart>
     </ResponsiveContainer>
     
     {/* Centered text for total queries */}
     <div className="absolute inset-0 flex items-center justify-center">
       <div className="text-center">
         <div className="text-sm font-bold text-gray-800">{totalUsers.toLocaleString()}</div>
         <div className="text-xs font-semibold text-gray-500">Total Queries</div>
       </div>
     </div>
   </div>

   {/* Details Section */}
   <div className="space-y-5">
     {data.map((entry, index) => (
       <div key={index} className="flex items-center text-gray-700 gap-x-2">
         <span
           className="inline-block w-16 rounded-full h-1 mr-2"
           style={{ backgroundColor: COLORS[entry.name] }}
         ></span>
        <div>
        <div className='flex flex-col'>
        <span className="capitalize">{entry.name}:</span>
        <span className="text-[12px]  font-bold">{entry.value.toLocaleString()} </span>
        </div>
        </div>
       </div>
     ))}
   </div>

 </div>
</div>
 </>
  );
};

export default CustomPieChart;
