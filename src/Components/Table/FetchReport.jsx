import React, { useState, useEffect } from 'react';
import TaskTable from './TaskTable';
import Filters from './Filters';
import Loader from '../Loaders/Loaders';
import CustomLoader from '../Loaders/CustomLoader';
import TaskTableUser from './TaskTableUser';
import Cookies from 'js-cookie';
import TaskTablePayment from './TaskTablePayment';
import TaskTableReport from './TaskTableReport';

// Status constants
const STATUS_PENDING = { id: 1, name: "Pending" };
const STATUS_IN_REVIEW = { id: 2, name: "In Review" };
const STATUS_RESOLVED = { id: 3, name: "Resolved" };

const FetchReport = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true); // New loading state


  console.log("data is ")
  console.log(data)
  // Fetch data function
  const fetchData = async () => {
    const userId = Cookies.get('userId');

    console.log("user id is ")
    console.log(userId)
    setLoading(true); // Set loading state to true when fetching starts
    const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;
    try {
      const response = await fetch('/report/getReports');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const result = await response.json();
      console.log("result is ")
      console.log(result)

     



      setData([result]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { fetchData() },[])



  return (
    <>
      <div className='text-[9px] sm:text-[10px] mdm:text-[12px] flex justify-center flex-col items-center montserrat poppins-regular mt-5 mb-10 w-full'>
        <div className="bg-white p-4 rounded-xl lg:w-[600px]">
          {/* Always show Filters component */}
      
          <div className='mt-2'>
            {/* Conditional rendering for loading state */}
            {loading ? (
              <CustomLoader />  // Show loading message when data is being fetched
            ) : (
              <TaskTableReport
                DATA={data[0]}
               
         
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FetchReport;
