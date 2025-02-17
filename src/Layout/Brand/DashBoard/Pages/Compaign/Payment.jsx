import ScreenSizeDisplay from "../../../../../useCurrentScreenSize";
import './Index.css';
import { useContext, useEffect, useState } from 'react';
import { CampaignContext } from './CurrentCompaign';
import axios from 'axios'; 

const Payment = () => {
  const campaignData = useContext(CampaignContext);
  const [transactions, setTransactions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noTransactions, setNoTransactions] = useState(false); // To handle "No transactions yet" case

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`/Brand/getTransactions/${campaignData._id}`);
        setTransactions(response.data); // Set transactions to the state
      } catch (err) {
        // Handle the case where there are no transactions
        if (err.response && err.response.status === 404 && err.response.data.message === "No transactions found for this deal ID.") {
          setNoTransactions(true); // Set flag for no transactions
        } else {
          setError("Failed to fetch transactions.");
          console.error(err);
        }
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    // Ensure that campaignData is ready before fetching
    if (campaignData && campaignData._id) {
      fetchTransactions(); 
    } else {
      setLoading(false); // No valid campaign data, stop loading
    }
  }, [campaignData]); // Dependency array to run effect when dealID changes

  if (loading) return <p>Loading...</p>;
  if (noTransactions) return <p>No transactions yet</p>; // Display if no transactions
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="bg-white mx-auto mt-10 rounded-3xl px-2 w-[300px] xs:w-[550px] sm:w-[600px] mdm:w-[700px] lg:w-[900px]">
        <p className="lato-bold pt-8 ml-7">Payment</p>
        <div className="rounded-xl lato-regular mdm:text-base mt-4 scroll-container">
          <div className="p-1 rounded-lg text-[9px] sm:text-[10px] mdm:text-[13px]">
            <div className="w-[900px] grid grid-cols-12 auto-rows-fr text-center border-b-2 pt-1 pb-1 border-t-[1px]">
              {/* Table Headers */}
              <div className="col-span-3 text-center">
                <p className="lato-bold">Influencer</p>
              </div>
              <div className="col-span-2 text-center">
                <p className="lato-bold">Date</p>
              </div>
              <div className="col-span-1">
                <p className="lato-bold">Payment</p>
              </div>
              <div className="col-span-2">
                <p className="lato-bold">Estimated Release Date</p>
              </div>
              <div className="col-span-2">
                <p className="lato-bold">Status</p>
              </div>
            </div>

            {/* Table Rows */}
            {transactions.map((data, index) => {
              // Extracting only the date part in YYYY-MM-DD format
              const formattedDeductedDate = data.deductedDate.slice(0, 10);
              const formattedReleaseDate = data.estimatedReleaseDate.slice(0, 10);

              return (
                <TableRows
                  key={index}
                  name={data.influencer.fullName} 
                  img={data.influencer.photo} 
                  likes={formattedDeductedDate}
                  Er={data.amount} 
                  releaseDate={formattedReleaseDate}
                  Status={data.status} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const TableRows = ({ name, img, likes, Er, releaseDate, Status }) => {
  return (
    <div className="w-[900px] grid grid-cols-12 text-center mt-3 border-b-[1px] pb-3 IsBorder">
      <div className="col-span-3 text-center">
        <div className="flex items-center justify-center gap-x-3">
          <img className='size-[35px] Avatar' src={img} alt={name} />
          <p>{name}</p>
        </div>
      </div>

      <div className="col-span-2 text-center flex justify-center">
        <div className="flex items-center">
          <p>{likes}</p>
        </div>
      </div>

      <div className="col-span-1">
        <p className="p-1">{Er}</p>
      </div>

      <div className="col-span-2">
        <p className="p-1">{releaseDate}</p>
      </div>

      <div className="col-span-2">
        <p className="p-1">{Status}</p>
      </div>
    </div>
  );
};

export default Payment;