import React, { useState, useEffect } from 'react';
import TaskTable from './TaskTable';
import Filters from './Filters';
import Loader from '../Loaders/Loaders';
import CustomLoader from '../Loaders/CustomLoader';
import TaskTablePayment from './TaskTablePayment';
import TaskTableInfluencer from './TaskTableInfluencer';
import TaskTableWithDraw from './TaskTableWithDraw';
import TaskTableContactUs from './TaskTableContactUs';
import FiltersContact from './FiltersContact';

// Status constants
const STATUS_PENDING = { id: 1, name: "pending" };
const STATUS_IN_REVIEW = { id: 2, name: "Payment Processing" };
const STATUS_RESOLVED = { id: 3, name: "Approved " };
const STATUS_REJECTED = { id: 4, name: "Rejected" };

const FetchContactUs = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");  // Status filter from the dropdown
  const [Update, setUpdate] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0, // initial page index
    pageSize: 6,  // default page size
  });
  const [loading, setLoading] = useState(true); // New loading state

  

  // Fetch data function
  const fetchData = async () => {
    setLoading(true); // Set loading state to true when fetching starts

    try {
     
      const url = `${import.meta.env.VITE_SERVER_BASE_URL}/Support/Contact?page=${pagination.pageIndex + 1}&search=${searchTerm}`;
      const response = await fetch(url);
      const result = await response.json();
  

      setData([result.data]);
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
          <FiltersContact searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFilterValue={setFilterValue} />

          <div className='mt-2'>
            {/* Conditional rendering for loading state */}
            {loading ? (
              <CustomLoader />  // Show loading message when data is being fetched
            ) : (
              <>

                <TaskTableContactUs
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

export default FetchContactUs;
