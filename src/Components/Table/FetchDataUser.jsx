import React, { useState, useEffect } from 'react';
import TaskTable from './TaskTable';
import Filters from './Filters';
import Loader from '../Loaders/Loaders';
import CustomLoader from '../Loaders/CustomLoader';
import TaskTableUser from './TaskTableUser';
import Cookies from 'js-cookie';

// Status constants
const STATUS_PENDING = { id: 1, name: "Pending" };
const STATUS_IN_REVIEW = { id: 2, name: "In Review" };
const STATUS_RESOLVED = { id: 3, name: "Resolved" };

const FetchDataUser = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");  // Status filter from the dropdown

  const [pagination, setPagination] = useState({
    pageIndex: 0, // initial page index
    pageSize: 6,  // default page size
  });
  const [loading, setLoading] = useState(true); // New loading state

  // Function to map status strings to the defined constants
  const mapStatus = (status) => {
    switch (status) {
      case "Pending":
        return STATUS_PENDING;
      case "In Review":
        return STATUS_IN_REVIEW;
      case "Resolved":
        return STATUS_RESOLVED;
      default:
        return status;
    }
  };
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
      const statusQuery = filterValue ? `&filter=${filterValue}` : ''; // Add status filter if selected
      const url2 = `${url}/Support/User/issues?page=${pagination.pageIndex + 1}&userId=${userId}&search=${searchTerm}${statusQuery}`;
      console.log("URl is")
      console.log(url2)
      const response = await fetch(url2);

      const result = await response.json();
      console.log("result is ")
      console.log(result)

      // Map through the data and convert the status field
      const results = result?.data?.map((issue) => ({
        ...issue,
        status: mapStatus(issue.status),
      }));



      setData([results, result.totalPages, result.totalIssues]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to re-fetch data when pagination, searchTerm, or filterValue changes
  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, searchTerm, filterValue]);

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 6 }); // Reset to the first page
  }, [searchTerm, filterValue]);




  return (
    <>
      <div className='text-[9px] sm:text-[10px] mdm:text-[12px] flex justify-center flex-col items-center montserrat poppins-regular mt-5 mb-10 w-full'>
        <div className="bg-white p-4 rounded-xl lg:w-[600px]">
          {/* Always show Filters component */}
          <Filters searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFilterValue={setFilterValue} />

          <div className='mt-2'>
            {/* Conditional rendering for loading state */}
            {loading ? (
              <CustomLoader />  // Show loading message when data is being fetched
            ) : (
              <TaskTableUser
                DATA={data[0]}
                pageCount={data[1]}
                totalUsers={data[2]}
                pagination={pagination}
                setPagination={setPagination}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FetchDataUser;
