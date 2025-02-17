import React, { useState, useEffect } from 'react';
import TaskTable from './TaskTable';
import Filters from './Filters';
import Loader from '../Loaders/Loaders';
import CustomLoader from '../Loaders/CustomLoader';
import TaskTablePayment from './TaskTablePayment';
import TaskTableInfluencer from './TaskTableInfluencer';

// Status constants
const STATUS_PENDING = { id: 1, name: "Pending" };
const STATUS_IN_REVIEW = { id: 2, name: "Payment Processing" };
const STATUS_RESOLVED = { id: 3, name: "Resolved" };
const STATUS_REJECTED = { id: 4, name: "Rejected" };

const FetchPaymentData = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");  // Status filter from the dropdown
  const [Update, setUpdate] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0, // initial page index
    pageSize: 6,  // default page size
  });
  const [loading, setLoading] = useState(true); // New loading state

  // Function to map status strings to the defined constants
  const mapStatus = (status) => {
    switch (status) {
      case false:
        return STATUS_PENDING;
      case true:
        return STATUS_RESOLVED;
      default:
        return status;
    }
  };

  // Fetch data function
  const fetchData = async () => {
    setLoading(true); // Set loading state to true when fetching starts

    try {
      const statusQuery = filterValue ? `&filter=${filterValue}` : ''; // Add status filter if selected
      // const url = `${import.meta.env.VITE_SERVER_BASE_URL}/Support/issues?page=${pagination.pageIndex + 1}&search=${searchTerm}${statusQuery}`;
      const url = `${import.meta.env.VITE_SERVER_BASE_URL}/support/InfluencerVerify`;
      const response = await fetch(url);
      const result = await response.json();
      console.log("result is ")
      console.log(result)

      // Map through the data and convert the status field
      const results = result?.map((issue) => ({
        ...issue,
        status: mapStatus(issue.status),
      }));



      setData([results, result.totalPages, result.totalUsers]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to re-fetch data when pagination, searchTerm, or filterValue changes
  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, searchTerm, filterValue, Update]);

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 6 }); // Reset to the first page
  }, [searchTerm, filterValue, Update]);


  return (
    <>
      <div className='text-[9px] sm:text-[10px] mdm:text-[12px] flex justify-center flex-col items-center montserrat poppins-regular mt-5 mb-10 w-full'>
        <div className="bg-white p-4 rounded-xl lg:w-[800px]">
          {/* Always show Filters component */}
          {/* <Filters searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFilterValue={setFilterValue} /> */}

          <div className='mt-2'>
            {/* Conditional rendering for loading state */}
            {loading ? (
              <CustomLoader />  // Show loading message when data is being fetched
            ) : (
              <>

                <TaskTableInfluencer
                  DATA={data[0]}
                  pageCount={data[1]}
                  totalUsers={data[2]}
                  pagination={pagination}
                  setPagination={setPagination}
                  Update={Update}
                  setUpdate={setUpdate}
                />


              </>

            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FetchPaymentData;
