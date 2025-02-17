import { DropdownSvg } from "../../../../../Components/Svg/DropDownSvg";
import ScreenSizeDisplay from '../../../../../useCurrentScreenSize';
import { CampaignContext } from './CurrentCompaign';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import SendInvitation from "./SendInvitation";
import moreIcon from '../../../../../../public/Svg/More.svg';
import { useNavigate } from 'react-router-dom';
import ProposalDetails from "./proposalDetails";

const Workflow = () => {

  const campaignData = useContext(CampaignContext);
  const [selectedInfluencers, setSelectedInfluencers] = useState([]);
  const [influencersOptions, setInfluencersOptions] = useState([]);
  const [totalSpendings, setTotalSpendings] = useState(0);

  const handleChange = (selectedOptions) => {
    if (selectedOptions.length <= 3) {
      setSelectedInfluencers(selectedOptions);
    }
  };

  useEffect(() => {
    const fetchInfluencerNetwork = async () => {
      try {
        // Fetch influencer network
        const networkResponse = await axios.get('/Brand/getNetwork', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
  
        const options = networkResponse.data.network.map(influencer => ({
          value: influencer.influencerID,
          label: influencer.name,
        }));
  
        // Fetch brand contracts
        const contractsResponse = await axios.get(`/Brand/getBrandContracts/${campaignData?._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (contractsResponse.data.message === "No contracts found for this deal ID.") {
          // If no contracts found, set options directly and return early
          setInfluencersOptions(options);
          return;
        }
  
        const influencerStatusMap = new Map();
        let totalSpendingsNum = 0;
  
        // Build a map to track all statuses for each influencer in contracts
        contractsResponse.data.contracts.forEach(contract => {
          const { influencerID, status, spendings } = contract;
          totalSpendingsNum += spendings;
          if (!influencerStatusMap.has(influencerID)) {
            influencerStatusMap.set(influencerID, []);
          }
          influencerStatusMap.get(influencerID).push(status);
        });
  
        setTotalSpendings(totalSpendingsNum);
        // Filter influencers:
        // 1. Include those with all contracts approved
        // 2. Include those with no contracts
        const filteredOptions = options.filter(option => {
          const statuses = influencerStatusMap.get(option.value);
          return !statuses || statuses.every(status => status === "Approved");
        });
  
        // Set the filtered options in state
        setInfluencersOptions(filteredOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchInfluencerNetwork();
  }, [campaignData]);  

  let rejectedCount = 0;
  let acceptedCount = 0;
  let requestedCount = 0;

  const [influencers, setInfluencers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchInfluencers = async () => {
      if (!campaignData) {
        console.warn("campaignData is null or undefined");
        setDataLoaded(true);
        return;
      }

      const userStatuses = campaignData.userStatuses;
      console.log("User Statuses: ", userStatuses);
      if (!userStatuses || userStatuses.length === 0) {
        console.warn("userStatuses is null or empty");
        setDataLoaded(true);
        return;
      }

      try {
        const userIDs = userStatuses.map(status => status.userID);

        const response = await axios.post('/Brand/getInfluencers',
          { influencerIDs: userIDs },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const data = response.data.influencers || [];
        console.log("Fetched Influencers Data:", data);

        const updatedInfluencers = data.map(influencer => {
          const status = userStatuses.find(status => status.userID === influencer._id);
          return {
            ...influencer,
            status: status ? status.status : 'Unknown'
          };
        });

        setInfluencers(updatedInfluencers);
      } catch (error) {
        console.error('Error fetching influencers:', error);
      } finally {
        setDataLoaded(true);
      }
    };

    fetchInfluencers();
  }, [campaignData]);

  if (campaignData?.userStatuses?.length) {
    campaignData.userStatuses.forEach(userStatus => {
      if (userStatus.status === 'Rejected') {
        rejectedCount++;
      } else if (userStatus.status === 'Accepted') {
        acceptedCount++;
      } else if (userStatus.status === 'Requested') {
        requestedCount++;
      }
    });
  }

  const campaignBudget = campaignData?.budget || 0;

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Accepted':
        return { borderColor: 'GreenButtonWithText', textColor: 'text-green-500' };
      case 'Requested':
        return { borderColor: 'OrangeButtonBorder', textColor: 'text-primary' };
      default:
        return { borderColor: 'border-gray-300', textColor: 'text-gray-300' };
    }
  };

  // Filter influencers to exclude "Invited" and "Approved" statuses
  const filteredInfluencers = influencers.filter(influencer => 
    influencer.status !== 'Invited' && influencer.status !== 'Approved' && influencer.status !== 'Rejected'
  );

  return (
    <>
      <div className="mx-10 mt-2 flex flex-wrap justify-center gap-4">
        <SimpleCard name="Budget" price={`$${campaignBudget}`} />
        <SimpleCard name="Rejected" price={rejectedCount} />
        <SimpleCard name="Accepted" price={acceptedCount} />
        <SimpleCard name="Requests" price={requestedCount} />
        <SimpleCard name="Spendings" price={totalSpendings} />
      </div>

      <div>
        <div>
          <div className="sm:flex justify-center gap-x-5 m-5 ">
            <div className="bg-white rounded-3xl px-4 py-5 mb-5">
              <div className="flex justify-between">
                <p className="poppins-semibold mt-2 ">Influencer</p>
                <div>
                </div>
              </div>

              {filteredInfluencers.length > 0 ? ( // Use filtered influencers here
                filteredInfluencers.map((influencer) => {
                  const { borderColor, textColor } = getStatusStyles(influencer.status);
                  return (
                    <InfluencerList
                      key={influencer._id}
                      ImageSrc={influencer.photo}
                      Name={influencer.fullName}
                      age={influencer.age}
                      ColorBorder={borderColor}
                      Status={influencer.status}
                      TextColor={textColor}
                      bio={influencer.bio || "This influencer has no bio."}
                      dealID={campaignData?._id}
                      userID={influencer._id}
                    />
                  );
                })
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  No requests at this time. Invite influencers to connect.
                </p>
              )}
            </div>

            <SendInvitation 
              influencersOptions={influencersOptions}
              selectedInfluencers={selectedInfluencers}
              spendings={totalSpendings}
              campaignBudget={campaignBudget}
              handleChange={handleChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const SimpleCard = ({ name, price }) => {
  return (
    <div className="text-[10px] w-[100px] h-[80px] mdm:w-[120px] mdm:h-[80px] bg-white rounded-2xl flex flex-col items-center justify-center">
      <div className="px-3 py-1 mdm:py-2 lato-regular text-center">
        <p className="lato-regular text-[14px]">{name}</p>
        <p className="text-sm mdm:text-[12px]">{price}</p>
      </div>
    </div>
  );
};

const InfluencerList = ({ ImageSrc, Name, age, ColorBorder, Status, TextColor, bio, dealID, userID }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const [showProposal, setShowProposal] = useState(false); // Control popup visibility
  const [successMessage, setSuccessMessage] = useState('');
  const [actionType, setActionType] = useState(''); // "Approve" or "Reject"
  const navigate = useNavigate();
  const [proposalDetails, setProposalDetails] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(false);

  const handleViewDetails = async () => {
    try {
      const response = await axios.get('/Brand/proposalDetails', { params: { dealID, userID } });
      setProposalDetails(response.data.proposal);
      setShowOptions(false);
      setShowProposal(true); // Show popup with proposal details
    } catch (error) {
      console.error('Error fetching proposal details:', error.response ? error.response.data : error.message);
      alert('Could not fetch proposal details. Please check your internet connection and try again.'); 
    }
  };  

  // Toggle More Click (show/hide dropdown)
  const handleMoreClick = () => {
    setShowOptions(!showOptions);
  };

  const handleActionClick = (type) => {
    setShowOptions(false);
    setActionType(type); // Set "Approve" or "Reject"
    setShowPopup(true); // Show confirmation popup
  };

  const confirmAction = async () => {
    setShowPopup(false); // Close the popup
    try {
        const apiEndpoint = actionType === 'Approve' ? '/Brand/approveProposal' : '/Brand/rejectProposal';

        // Initialize FormData for file upload if action is "Approve"
        const formData = new FormData();
        formData.append('dealID', dealID);
        formData.append('userID', userID);

        // Only append the screenshot if action is "Approve" and file is selected
        if (actionType === 'Approve') {
            if (selectedFile) {
                formData.append('screenshot', selectedFile); // Add screenshot to FormData
            } else {
                alert("Screenshot is required for approval.");
                return;
            }
        }

        // Set headers based on whether there is a file (multipart if Approving, else JSON)
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': actionType === 'Approve' ? 'multipart/form-data' : 'application/json'
        };

        // Send the PUT request to the API with FormData
        const response = await axios.put(apiEndpoint, formData, { headers });

        // Set success message accordingly
        setSuccessMessage(`Proposal ${actionType.toLowerCase()}d successfully.`);
        setTimeout(() => {
            setSuccessMessage('');
            navigate('/Compaign'); // Redirect to the Campaign page after 1 second
        }, 1000);
    } catch (error) {
        console.error(`Error ${actionType.toLowerCase()}ing proposal:`, error.response ? error.response.data : error.message);
        alert(`An error occurred while trying to ${actionType.toLowerCase()} the proposal. Please try again.`);
    }
  }; 

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Validate file type
    if (file && file.type.match(/image\/(png|jpeg|jpg)/)) {
        setSelectedFile(file);
        setFileError(false);
    } else {
        setFileError(true);
    }
  };

  return (
    <div className="mt-5">
      <div className="flex items-center">
        <div className="flex items-center size-[35px] sm:size-[50px]">
          <img className="aspect-square Avatar" src={ImageSrc} alt="" />
        </div>

        <div className="flex justify-between items-center w-full max-w-[calc(100% - 20px)] text-[10px] sm:text-[11px] mdm:text-[13px]">
          <div className="poppins-regular ml-3 mr-3 flex-1">
            <p className="poppins-semibold">{Name}</p>
            <p className="poppins-regular text-black/40">{age} years</p>
            <p>{bio.length > 30 ? `${bio.substring(0, 30)}...` : bio}</p>
          </div>

          <div className="w-[80px] sm:w-[110px] mdm:w-[130px] text-center">
            <p className={`${ColorBorder} cursor-pointer ${TextColor}`}>{Status}</p>
          </div>

          <div className="flex-shrink-0 ml-4 relative">
            <img
              src={moreIcon}
              alt="More"
              className="inline-block cursor-pointer"
              onClick={handleMoreClick}
            />

            {/* Show dropdown only if Status is 'Requested' and 'More' button is clicked */}
            {Status === 'Requested' && showOptions && (
              <div className="absolute right-0 bg-white border border-gray-300 rounded shadow-md mt-2 z-10">
                <ul className="text-sm">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleActionClick('Approve')}
                  >
                    Approve
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleActionClick('Reject')}
                  >
                    Reject
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleViewDetails}
                  >
                    View Proposal</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Message</li>
                </ul>
              </div>
            )}

            {/* Show 'Message' button if Status is 'Accepted' */}
            {Status === 'Accepted' && (
              <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                Message
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Popup for Approving/Rejecting */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
                <h3 className="text-lg font-semibold">
                    {actionType === 'Approve' ? 'Approve Proposal' : 'Reject Proposal'}
                </h3>
                
                {/* Show account details and screenshot upload if the action is Approve */}
                {actionType === 'Approve' && (
                    <>
                        <div className="mt-4">
                            <p className="font-bold">Account Number:</p>
                            <p>0305 8761739 (Easypaisa)</p>
                        </div>
                        <div className="mt-2">
                            <p className="font-bold">Account Holder Name:</p>
                            <p>Ali Saif</p>
                        </div>
                        <div className="mt-4">
                            <label className="block font-bold mb-2">Upload Screenshot:</label>
                            <input
                                type="file"
                                className="border p-2 w-full mt-1"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange} // Ensure you define this handler to set the screenshot in state
                            />
                        </div>
                    </>
                )}

                <p>Are you sure you want to {actionType.toLowerCase()} this proposal?</p>
                <div className="flex justify-end mt-4">
                    <button
                        className="mr-2 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                        onClick={() => setShowPopup(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className={`bg-${actionType === 'Approve' ? 'green' : 'red'}-500 text-white px-3 py-1 rounded hover:bg-${actionType === 'Approve' ? 'green' : 'red'}-600`}
                        onClick={confirmAction}
                    >
                        {actionType}
                    </button>
                </div>
            </div>
        </div>
      )}

      {showProposal && proposalDetails && (
        <ProposalDetails 
          details={proposalDetails} 
          onClose={() => setShowProposal(false)} // Close the popup when the button is clicked
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Workflow;