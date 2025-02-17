import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownSvg } from '../../../../../Components/Svg/DropDownSvg'; // Adjust the import as needed
import axios from 'axios';

const WorkDetails = ({ contracts }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const navItems = ['All', 'Accepted', 'Draft', 'Approved', 'Reviewing', 'Instructed'];
    const navigate = useNavigate();

    // Filter contracts based on the selected filter
    useEffect(() => {
        if (selectedFilter === 'All') {
            setFilteredData(contracts); // Show all contracts when "All" is selected
        } else {
            const filtered = contracts.filter(contract => {
                const lastStatus = contract.milestones[contract.milestones.length - 1].status;
                return lastStatus === selectedFilter;
            });
            setFilteredData(filtered);
        }
    }, [contracts, selectedFilter]);

    return (
        <>
            <div className="mt-10 pb-5">
                <div className="flex justify-start mt-5 ml-10 gap-x-3">
                    <Dropdown
                        key={1}
                        items={navItems}
                        initialValue="All"
                        onSelect={(filter) => setSelectedFilter(filter)} // Set the selected filter
                    />
                </div>
    
                <div className="mt-5 space-y-10 text-[9px] xs:text-[10px] sm:text-[10px] md:text-[11px]">
                    {/* Deal list */}
                    {filteredData.length > 0 ? (
                        // Exclude contracts where the last milestone status is "Invited"
                        filteredData
                            .filter(contract => {
                                const lastStatus = contract.milestones[contract.milestones.length - 1].status;
                                return lastStatus !== "Invited"; // Exclude if status is "Invited"
                            })
                            .map((contract, index) => (
                                <Deal
                                    key={index}
                                    deal={{
                                        _id: contract._id,
                                        brandImage: contract.brandImage,
                                        brandName: contract.brandName,
                                        dealImage: contract.dealImage,
                                        campaignDes: contract.deliverables,
                                    }}
                                    status={contract.milestones[contract.milestones.length - 1].status}
                                    onClick={() => navigate('/BrandWork/content', { state: { proposalID: contract.proposalID } })}
                                />
                            ))
                    ) : (
                        <p className="text-center">No contracts available</p>
                    )}
                </div>
            </div>
        </>
    );    
};

const Dropdown = ({ items, initialValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState([0, initialValue]);

    const handleSelect = (item) => {
        setIsOpen([0, item]);
        onSelect(item);
    };

    return (
        <div className="flex items-center flex-col poppins-semibold rounded-xl bg-white relative text-[9px] xs:text-[10px] sm:text-[13px] md:text-[14px]">
            <div
                className="px-2 py-1 sm:p-2 flex justify-between w-[100px] sm:w-[120px] items-center relative"
                onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}>
                <div>{isOpen[1]}</div>
                <DropdownSvg />
            </div>
            {isOpen[0] ? (
                <ul className="poppins-regular flex gap-y-2 flex-col mt-2 absolute top-10 bg-white w-full p-2 rounded-xl">
                    {items.map((item, index) =>
                        isOpen[1] !== item ? (
                            <li key={index} className="dropdown-item" onClick={() => handleSelect(item)}>
                                {item}
                            </li>
                        ) : null
                    )}
                </ul>
            ) : ""}
        </div>
    );
};

const Deal = ({ deal, status, onClick }) => {
    const [cancelRequest, setCancelRequest] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [message, setMessage] = useState(''); // Message to display approval status

    // Function to handle approval
    const handleApprove = async () => {
        setLoading(true); // Set loading state
        setMessage('Approving...'); // Show loading message
        try {
            // Make API request to approve cancellation
            const response = await axios.put(`/api/approveCancelRequest/${deal._id}`);
            setLoading(false); // Stop loading
            setCancelRequest(false); // Close the popup
            setMessage('Cancellation Approved Successfully'); // Success message
            console.log('Cancellation Approved', response.data);
        } catch (error) {
            setLoading(false); // Stop loading
            setMessage('Failed to Approve Cancellation'); // Error message
            console.error('Approval Error:', error);
        }
    };

    const handleReject = async () => {
        setLoading(true); // Set loading state
        setMessage('Rejecting...'); // Show loading message
        try {
            // Make API request to approve cancellation
            const response = await axios.put(`/api/rejectCancelRequest/${deal._id}`);
            setLoading(false); // Stop loading
            setCancelRequest(false); // Close the popup
            setMessage('Cancellation Rejected Successfully'); // Success message
            console.log('Cancellation Approved', response.data);
        } catch (error) {
            setLoading(false); // Stop loading
            setMessage('Failed to reject Cancellation'); // Error message
            console.error('Approval Error:', error);
        }
    }

    // Function to close the popup
    const handleClosePopup = () => {
        setCancelRequest(false);
        setMessage(''); // Reset the message
    };

    const checkCancellationRequest = () => {
        setCancelRequest(true);
    };

    return (
        <div className="relative flex xs:flex-col mdm:flex-row w-[250px] xs:w-[450px] sm:w-[550px] mdm:w-[600px] md:w-[700px] lg:w-[900px] mx-auto bg-white overflow-hidden rounded-xl">
            {/* Post Image Left side */}
            <div
  className="hidden  h-full mdm:flex mdm:h-[200px] mdm:w-[500px] md:h-[200px] md:w-[300px] md:items-center justify-center shrink-0"
>
  <div className="flex items-center justify-center h-full w-full">
    <img
      className="Avatar-v1 object-contain"
      src='https://picsum.photos/300/500'
    //   src={deal.dealImage}
      alt=""
    />
  </div>
</div>

            {/* Right Side of the Post */}
            <div className="ml-5 pt-2 pr-2">
                <div className="flex gap-x-2 items-center">
                    <div className="flex items-center size-[35px] sm:size-[50px]">
                        <img className="aspect-square Avatar" src={deal.brandImage} alt="" />
                    </div>
                    <div className="poppins-regula text-[7px] sm:text-[10px] mdm:text-[12px]">
                        <p className="poppins-semibold">{deal.brandName}</p>
                    </div>
                </div>

                <div className="text-black/60 poppins-semibold mt-1">
                    <p>{deal.campaignDes}</p>
                </div>

                <div className="flex flex-wrap pb-2 xs:w-full xs:flex gap-x-3 mt-5">
                    <div className="flex gap-x-3">
                        {status === 'Accepted' && (
                            <div className="OrangeButtonBorder-v1 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer" onClick={onClick}>
                                <p>New Posts</p>
                            </div>
                        )}
                        {status === 'cancelRequest' && (
                            <div className="OrangeButtonBorder-v1 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer"
                                onClick={checkCancellationRequest}>
                                <p>Cancellation Request</p>
                            </div>
                        )}
                        {status === 'Draft' && (
                            <div className="GreenButtonWithText-v2 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer" onClick={onClick}>
                                <p>Drafted</p>
                            </div>
                        )}
                        {status === 'Reviewing' && (
                            <div className="GreenButtonWithText-v2 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer" onClick={onClick}>
                                <p>Awaiting Approval</p>
                            </div>
                        )}
                        {status === 'Instructed' && (
                            <div className="GreenButtonWithText-v2 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer" onClick={onClick}>
                                <p>Instructed</p>
                            </div>
                        )}
                        {status === 'Awaiting InstaLink' && (
                            <div className="BlueButtonWithText-v1 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer" onClick={onClick}>
                                <p>Awaiting InstaLink</p>
                            </div>
                        )}
                        {status === 'LinkSubmitted' && (
                            <div className="OrangeButtonBorder-v1 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer">
                                <p>Awaiting Payment</p>
                            </div>
                        )}
                        {status === 'Approved' && (
                            <div className="GreenButtonWithText-v2 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer">
                                <p>Approved</p>
                            </div>
                        )}
                        {status === 'Cancelled' && (
                            <div className="BlueButtonWithText-v1 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer">
                                <p>Cancelled</p>
                            </div>
                        )}
                        {status === 'Payment Pending' && (
                            <div className="BlueButtonWithText-v1 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer">
                                <p>Payment Pending</p>
                            </div>
                        )}
                        {status === 'Payment Processing' && (
                            <div className="BlueButtonWithText-v1 text-primary mt-2 xs:mt-0 flex items-center cursor-pointer">
                                <p>Payment Processing</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pop-up Screen for Cancellation Request */}
            {cancelRequest && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="bg-white rounded-lg p-5 w-[300px] sm:w-[400px] relative">
                    {/* Close Icon */}
                    <button
                        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                        onClick={handleClosePopup}
                    >
                        &times;
                    </button>

                    <h3 className="text-lg font-semibold">Cancellation Request</h3>
                    <p className="mt-2 mb-4">Are you sure you want to approve or reject the cancellation request?</p>

                    {/* Message */}
                    {message && <p className="text-sm text-blue-500 mb-2">{message}</p>}

                    <div className="flex justify-end gap-3">
                        {/* Approve Button */}
                        <button
                            className={`bg-green-500 text-white px-4 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleApprove}
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? 'Approving...' : 'Approve'}
                        </button>

                        {/* Reject Button */}
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                            onClick={handleReject} // Add the reject functionality here
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default WorkDetails;