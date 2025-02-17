import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Response = () => {
  const [brandData, setBrandData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userID, setUserID] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [success, setSuccess] = useState(false);

  const navItems = ['All', 'Requested', 'Approved', 'Invited'];

  useEffect(() => {
    // Fetch userID from the backend
    axios.get('/auth/getID', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    })
      .then(response => {
        setUserID(response.data.userID);
      })
      .catch(error => {
        console.error('Error fetching userID:', error);
      });
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
          console.error('No authToken found in local storage');
          return;
        }

        const response = await axios.get('/api/getDealsByUserID', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setBrandData(response.data);
        setFilteredData(response.data); // Initialize filteredData with all deals
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
    };

    fetchDeals();
  }, [success]);

  const handleDealSuccess = () => {
    setSuccess(true); // Set success to true upon successful operation
    setTimeout(() => setSuccess(false), 1000); // Clear success message after 1 seconds
  };
  useEffect(() => {
    const filterDataByStatus = () => {
      if (selectedFilter === 'All') {
        setFilteredData(brandData);
      } else {
        const filtered = brandData.map(brand => ({
          ...brand,
          deals: brand.deals.filter(deal =>
            deal.userStatuses.some(
              status => status.userID === userID && status.status === selectedFilter
            )
          ),
        })).filter(brand => brand.deals.length > 0); // Remove brands with no deals

        setFilteredData(filtered);
      }
    };

    if (userID && brandData.length > 0) {
      filterDataByStatus();
    }
  }, [selectedFilter, userID, brandData]);

  return (
    <>
      <div className="text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px]">
        <div className="list-none w-[200px] xs:w-[400px] ml-10 flex rounded-full mt-5 sm:flex-nowrap gap-x-3 lg:gap-x-4">
          <NavBarItems items={navItems} path={'Dashboard'} setSelectedFilter={setSelectedFilter} />
        </div>

        <div className="mt-10 space-y-10 pb-10 text-[9px] xs:text-[10px] sm:text-[10px] md:text-[11px]">
          {filteredData.length > 0 ? (
            filteredData.map((brand, index) => (
              brand.deals.map((deal, dealIndex) => (
                deal.userStatuses.length > 0 ? (
                  deal.userStatuses.map((status, statusIndex) => (
                    <Deal
                      key={`${index}-${dealIndex}-${statusIndex}`} // Unique key for each deal and user status
                      deal={{
                        id: deal._id,
                        brandImage: brand.brandImage,
                        brandName: brand.brandName,
                        dealImage: deal.dealImage,
                        campaignDes: deal.campaignDes,
                        category: deal.category,
                        budget: deal.budget,
                        userStatuses: deal.userStatuses,
                        userID: userID,
                      }}
                      status={status} // Pass the current user status if needed
                      onSuccess={handleDealSuccess} // Trigger success handler

                    />
                  ))
                ) : null // You can choose to render null if no user statuses exist
              ))
            ))
          ) : (
            <p className="text-center">No deals available</p>
          )}
        </div>
      </div>
    </>
  );
};

const NavBarItems = ({ items, setSelectedFilter }) => {
  const [isHover, setIsHover] = useState(-1);
  const [isActive, setIsActive] = useState(0);

  const handleItemClick = (index, item) => {
    setIsActive(index);
    setSelectedFilter(item); // Set the selected filter based on clicked item
  };

  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          className="poppins-regular relative z-50 w-full text-center py-1 sm:py-2 cursor-pointer bg-white rounded-full"
          onMouseEnter={() => setIsHover(index)}
          onMouseLeave={() => setIsHover(-1)}
          onClick={() => handleItemClick(index, item)}
        >
          <li
            className={`${isHover === index ? 'text-primary' : ''} ${isActive === index ? 'text-white' : ''
              }`}
          >
            <p>{item}</p>
            {isActive === index && (
              <motion.div
                layoutId="1"
                className="absolute w-full bg-black h-full top-0 left-0 rounded-full -z-10"
              ></motion.div>
            )}
          </li>
        </div>
      ))}
    </>
  );
};

const Modal = ({ isOpen, onClose, contractDetails, deal, isRequested, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const receivingAmount = contractDetails.contractBudget * 0.9;

  if (!isOpen) return null; // If the modal is not open, return null
  const handleAccept = async () => {
    setLoading(true);
    setError(null); // Reset error state
  
    try {
      const authToken = localStorage.getItem('authToken'); // Get the auth token from localStorage
      const response = await axios.put(`/api/acceptContract/${contractDetails.id}`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      // Optionally, handle response data (e.g., update contract details or refresh data)
      if (response.data) {
        console.log('Contract accepted successfully:', response.data);
        // You can update any state here if you need to reflect the changes in the UI
      }
  
      // Close the modal or refresh the parent component state
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error accepting contract:', error);
  
      // Handle specific error messages from the server
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
  
        if (errorMessage === 'This offer has expired') {
          setError('This offer has expired. You cannot accept the contract anymore.');
        } else {
          setError(errorMessage || 'Failed to accept the contract. Please try again.');
        }
      } else {
        // General error message if no specific message is provided
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
    
  // Handle the Withdraw logic (Delete proposal)
  const handleWithdraw = async () => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const authToken = localStorage.getItem('authToken'); // Get the auth token from localStorage
      await axios.put(`/api/deleteProposal/${deal.id}`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Optionally, close the modal or refresh the data here
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error withdrawing proposal:', error);
      setError('Failed to withdraw the proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-5 w-11/12 max-w-lg">
        {/* <h2 className="text-lg font-bold mb-4">{deal.brandName}</h2> */}
        <p className="poppins-semibold text-[14px]">Description:</p>
        <p className='className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50"'>{deal.campaignDes}</p>

        <div className='grid grid-cols-2 gap-3'>
        <div className="text-[14px] ">
          <p className="poppins-semibold text-[14px]">Contract Budget:</p>
          <div className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50" rows="4" placeholder="Write something...">${contractDetails.contractBudget}</div>
          </div>
        <div className="text-[14px] ">
          <p className="poppins-semibold text-[14px]">You will receive:</p>
          <div className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50" rows="4" placeholder="Write something...">${receivingAmount}</div>
          </div>
        <div className="text-[14px] ">
          <p className="poppins-semibold text-[14px]">Contract Status:</p>
          <div className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50" rows="4" placeholder="Write something...">${contractDetails.status}</div>
          </div>
        <div className="text-[14px] ">
          <p className="poppins-semibold text-[14px]">Category:</p>
          <div className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50" rows="4" placeholder="Write something...">${deal.category}</div>
          </div>
        </div>

        

        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

        <div className="mt-4 flex justify-end">
          {/* Show Accept button if status is 'Invited' and it is not a requested deal */}
          {contractDetails.status === 'Invited' && !isRequested && (
            // <div
            //   className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            //   onClick={handleAccept}
            //   disabled={loading}
            // >
            //   {loading ? 'Accepting...' : 'Accept'}
            // </div>

            <div className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg flex justify-center  mx-3 cursor-pointer" onClick={handleAccept}
              disabled={loading}>{loading ? 'Accepting...' : 'Accept'}</div>
          )}

          {/* Show Withdraw button if it's a requested deal */}
          {isRequested && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleWithdraw}
              disabled={loading}
            >
              {loading ? 'Withdrawing...' : 'Withdraw'}
            </button>
          )}


          <div className="w-full text-primary  border-primary border-2 flex justify-center py-2 px-4 rounded-lg outline-[1]  mx-3 cursor-pointer" onClick={onClose}>Close</div>


        </div>
      </div>
    </div>
  );
};

const Deal = ({ deal, status, onSuccess }) => {
  const { userID } = deal; // Destructure userID from deal
  const [modalOpen, setModalOpen] = useState(false);
  const [contractDetails, setContractDetails] = useState({});
  const [loadingContractDetails, setLoadingContractDetails] = useState(false); // Added loading state for contract details
  const [contractError, setContractError] = useState(null); // Added error state

  const contractID = status.contractID;

  // Determine if the current user has requested or been invited based on the new status structure
  const isRequested = status.userID === userID && status.status === 'Requested';
  const isInvited = status.userID === userID && status.status === 'Invited';

  // Function to handle opening the modal
  const openModal = async () => {
    setModalOpen(true);
    setLoadingContractDetails(true); // Start loading
    setContractError(null); // Reset error state

    try {
      const authToken = localStorage.getItem('authToken'); // Get the auth token from localStorage
      if (!authToken) throw new Error('No auth token found'); // Guard clause for auth token

      const response = await axios.get(`/api/getContractDetails/${contractID}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data && response.data.contractDetails) {
        const { budget, status, contractID } = response.data.contractDetails;

        // Set contract details with the budget and status
        setContractDetails({
          contractBudget: budget, // Get the budget
          status: status,         // Get the status
          id: contractID
        });
      } else {
        throw new Error('Contract details not found in response.');
      }
    } catch (error) {
      console.error('Error fetching contract details:', error);
      setContractError('Failed to fetch contract details'); // Set error message
    } finally {
      setLoadingContractDetails(false); // End loading
    }
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setModalOpen(false);
  };


  return (
    <div className="flex xs:flex-col mdm:flex-row w-[250px] xs:w-[450px] sm:w-[550px] mdm:w-[600px] md:w-[700px] lg:w-[900px] mx-auto bg-white overflow-hidden rounded-xl">
      <div className="hidden mdm:flex mdm:h-[200px] mdm:w-[500px] md:h-[200px] md:w-[600px] md:items-center justify-center">
        <img className="aspect-square Avatar-v1" src={deal.dealImage} alt="" />
      </div>
      <div className="ml-5 pt-2 pr-2">
        <div className="flex gap-x-2 items-center">
          <div className="flex items-center size-[35px] sm:size-[50px]">
            <img className="aspect-square Avatar" src={deal.brandImage} alt="" />
          </div>
          <div className="poppins-regular text-[7px] sm:text-[10px] mdm:text-[12px]">
            <p className="poppins-semibold">{deal.brandName}</p>
          </div>
        </div>
        <div className="text-black/60 poppins-semibold mt-1">
          <p>{deal.campaignDes}</p>
        </div>
        <div className="hidden xs:flex gap-2 mt-2 mb-2 poppins-semibold">
          <p className='SilverButtonWithText-v1 cursor-pointer'>{deal.category}</p>
        </div>
        <div className="flex justify-between mx-2 items-center pb-2 mt-2 text-center poppins-semibold">
          <div>
            <p>Campaign Budget</p>
            <p className='GreenButtonWithText-v1 py-2 cursor-pointer pt-2'>${deal.budget}</p>
          </div>
          <div className="flex space-x-2">
            <div
              className={`${isRequested || isInvited
                  ? 'OrangeButtonBorder text-primary'
                  : 'SilverButtonWithText-v3'
                } mt-2 xs:mt-0 flex items-center cursor-pointer`}
            >
              <p>{isRequested ? 'Requested' : isInvited ? 'Invited' : 'Approved'}</p>
            </div>
            {/* Three dots for opening the modal */}
            <span onClick={openModal} className="mt-2 xs:mt-0 cursor-pointer text-gray-500 hover:text-black">
              &#8230; {/* This represents three dots */}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        contractDetails={contractDetails}
        loading={loadingContractDetails}
        error={contractError} // Pass error to modal for display if needed
        deal={deal}
        isRequested={isRequested}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default Response;