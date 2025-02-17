import { CampaignContext } from './CurrentCompaign';
import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import more from '../../../../../../public/Svg/More.svg';
import { useNavigate } from 'react-router-dom';
import ContractDetails from './ContractDetails';
import QueryReportModal from './query';
import PostModal from './PostModal';

const Dashboard = () => {
  const campaignData = useContext(CampaignContext);

  // Initialize counters for user statuses
  let invitedCount = 0;
  let acceptedCount = 0;
  let draftedCount = 0;
  let instructedCount = 0;

  const [influencers, setInfluencers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [totalSpendings, setTotalSpendings] = useState(0); // New state for totalSpendings

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await axios.get(`/Brand/getBrandContracts/${campaignData?._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = response.data?.contracts;
        const fetchedTotalSpendings = response.data?.totalSpendings;

        if (Array.isArray(data) && data.length > 0) {
          const updatedInfluencers = data.map(influencer => ({
            _id: influencer.influencerID,
            status: influencer.status,
            bio: influencer.bio,
            photo: influencer.photo,
            fullName: influencer.fullName,
            age: influencer.age,
            contractID: influencer.contractID,
            postLinks: influencer.postLinks,
            budget: influencer.budget
          }));

          setInfluencers(updatedInfluencers);
        } else {
          console.warn("No influencer data available.");
          setInfluencers([]);
        }

        // Set the totalSpendings in state
        setTotalSpendings(fetchedTotalSpendings || 0);

      } catch (error) {
        console.error('Error fetching influencers:', error);
      }
    };

    if (campaignData && campaignData.userStatuses && campaignData.userStatuses.length > 0) {
      fetchInfluencers();
    }

    setDataLoaded(true);
  }, [campaignData]);


  // Loop through influencer statuses and count the statuses
  if (influencers.length) {
    influencers.forEach(influencer => {
      if (influencer.status === 'Invited') {
        invitedCount++;
      } else if (influencer.status === 'Reviewing') {
        draftedCount++;
      } else if (influencer.status === 'Accepted') {
        acceptedCount++;
      } else if (influencer.status === 'Instructed') {
        instructedCount++;
      }
    });
  }

  // Extract the budget from campaignData
  const campaignBudget = campaignData?.budget || 0;

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Invited':
        return { borderColor: 'border-gray-500', textColor: 'text-gray-500' };
      case 'Accepted':
        return { borderColor: 'border-green-500', textColor: 'text-green-500' };
      case 'Reviewing':
        return { borderColor: 'border-primary', textColor: 'text-primary' };
      case 'Instructed':
        return { borderColor: 'bg-blue-500', textColor: 'text-blue-500' };
      case 'Approved':
        return { borderColor: 'border-green-500', textColor: 'text-green-500' };
      case 'Awaiting InstaLink':
        return { borderColor: 'border-primary', textColor: 'text-primary' };
      case 'LinkSubmitted':
        return { borderColor: 'border-purple-500', textColor: 'text-purple-500' };
      case 'Payment Pending':
        return { borderColor: 'border-gray-500', textColor: 'text-gray-500' };
      case 'Payment Processing':
        return { borderColor: 'border-orange-500', textColor: 'text-orange-500' };
      default:
        return { borderColor: 'border-gray-300', textColor: 'text-gray-300' };
    }
  };

  return (
    <>
      {/* Simple cards will be displayed here */}
      <div className="mx-10 mt-2 flex flex-wrap justify-center gap-4">
        <SimpleCard name="Budget" price={`$${campaignBudget}`} />
        <SimpleCard name="Invited" price={invitedCount} />
        <SimpleCard name="Accepted" price={acceptedCount} />
        <SimpleCard name="In Review" price={draftedCount} />
        <SimpleCard name="Instructed" price={instructedCount} />
      </div>

      <div>
        {/* Showing all the Influencers here */}
        <div>
          {/* Wrapper around the List */}
          <div className="sm:flex justify-center gap-x-5 m-5">
            {/* Heading and outer Wrapper */}
            <div className="bg-white rounded-3xl px-4 py-5 mb-5">
              <p className="poppins-semibold mt-2">Contracts</p>

              {/* Check if there are influencers */}
              {influencers.length > 0 ? (
                influencers.map((influencer) => {
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
                      contractID={influencer.contractID}
                      DealID={campaignData?._id}
                      postLinks={influencer.postLinks}
                      budget={influencer.budget}
                      totalSpending={totalSpendings}
                      campaignBudget={campaignData?.budget}
                    />
                  );
                })
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  No requests at this time. Invite influencers to connect.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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

const InfluencerList = ({ ImageSrc, Name, age, ColorBorder, Status, TextColor, bio, contractID,
  DealID, postLinks, totalSpending, budget, campaignBudget }) => {

  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [contractDetails, setContractDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showQueryReportModal, setShowQueryReportModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showLinks, setShowLinks] = useState(false);
  const [instaMediaLinks, setInstaMediaLinks] = useState([]);
  const [error, setError] = useState();
  const [showPaymentOption, setShowPaymentOption] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();



  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the menuRef exists and does not contain the clicked target
      // Also check if the clicked target is not the "More" icon
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)

      ) {
        setShowDropdown(false);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array to add listener only once



  // Handle Cancel Contract action
  const handleCancelContract = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Get token from local storage
      if (!token) {
        setErrorMessage('You need to be logged in to perform this action');
        return;
      }

      const response = await axios.put(`/Brand/cancelContractRequest/${contractID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Contract cancellation request submitted successfully.');
        // Optionally, navigate to another page after canceling (e.g., campaign overview)
        setTimeout(() => {
          navigate('/Compaign');
        }, 1000);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to submit the contract cancellation request.');
      }
    }
  };

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle Withdraw action
  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const token = localStorage.getItem('authToken'); // Get token from local storage
      if (!token) {
        setErrorMessage('You need to be logged in to perform this action');
        return;
      }

      const response = await axios.delete(
        `/Brand/contracts/withdraw`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            contractID,
            dealID: DealID,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Contract successfully withdrawn');
        setTimeout(() => {
          navigate('/Compaign');
        }, 1000);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to withdraw the contract.');
      }
    } finally {
      setShowDropdown(false); // Close dropdown after action
      setIsWithdrawing(false);
    }
  };

  const confirmWithdraw = () => {
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      handleWithdraw();
    }
    setShowConfirmation(false);
  };

  const handleDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setErrorMessage('You need to be logged in to view contract details.');
        return;
      }

      const response = await axios.get(`/Brand/getContractDetails/${contractID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContractDetails(response.data.contract);
      setShowPopup(true);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to fetch contract details.');
      }
    } finally {
      setShowDropdown(false); // Close dropdown after action
    }
  };

  // Function to handle opening the query report modal
  const handleReport = () => {
    setShowQueryReportModal(true); // Show the QueryReportModal
    setShowDropdown(false); // Close dropdown
  };

  const viewPosts = async () => {
    try {
      console.log("Post Links: ", postLinks);

      // API request to fetch posts using the postLinks
      const response = await axios.post('/Brand/sendPosts', { postLinks });

      // Set the posts in state
      setPosts(response.data.mediaPosts);

      // Toggle to show the posts
      setShowPosts(true);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    }
  };

  const handleApprove = async (postId) => {
    // API call to approve the post
    try {
      const response = await axios.put(`/Brand/approveMedia/${postId}`);

      if (response.status === 200) {
        setSuccessMessage('Post approved successfully.');
        navigate('/Compaign');
        // Optionally refresh posts or update state
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to approve the post.');
      }
    }
  };

  const handleInstruct = async () => {
    if (!instruction) {
      setErrorMessage('Instruction cannot be empty.');
      return;
    }

    // API call to instruct the post
    try {
      const response = await axios.put(`/Brand/instructMedia/${selectedPostId}`, { instructions: instruction });

      if (response.status === 200) {
        setInstruction(''); // Clear the input after successful submission
        setSelectedPostId(null); // Reset selected post ID
        navigate('/Compaign');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to send instruction.');
      }
    }
  };

  const viewLinks = async () => {
    try {
      setShowLinks(true); // Show the pop-up screen

      // Make API call to fetch instaMedia by contractID
      const response = await fetch(`/Brand/verifyLinks/${contractID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Send auth token in headers
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }

      const data = await response.json();

      setInstaMediaLinks(data); // Store the fetched instaMedia in the state
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching instaMedia links:', error);
      setError('Failed to fetch links. Please try again later.');
      setInstaMediaLinks([]); // Clear links if there's an error
    } finally {
      setShowDropdown(false);
    }
  };

  const approveContract = async () => {
    try {
      const response = await fetch(`/Brand/approveContract/${contractID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include the auth token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve contract');
      }

      const data = await response.json();
      console.log('Contract approved:', data);
      setShowLinks(false); // Close the pop-up after approval
      navigate('/Compaign');

    } catch (error) {
      console.error('Error approving contract:', error);
      setError('Failed to approve contract. Please try again later.');
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

  const handleScreenShotSubmit = async () => {
    // Calculate the remaining budget for this campaign
    const remainingBudget = campaignBudget - totalSpending;

    // Check if the current budget + totalSpendings is within the campaign budget
    if (budget + totalSpending > campaignBudget) {
      alert(`You have ${remainingBudget} left in your campaign budget, and the current budget exceeds it. Please adjust the budget.`);
      return; // Exit the function if the budget exceeds the limit
    }

    // Proceed with submission if the budget is within limits
    if (!fileError) {
      const formData = new FormData();

      // Append the file and contractID to the FormData
      formData.append('screenshot', selectedFile);
      formData.append('contractID', contractID);

      try {
        setIsLoading(true); // Set loading state to true when starting upload

        const response = await fetch('/Brand/uploadTransactionProof', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Upload successful:", data);
          setShowPaymentOption(false);
          navigate('/Compaign');
        } else {
          // Handle errors from the server
          console.error("Upload failed:", data.message);
          alert(data.message); // Display error message to user
        }
      } catch (error) {
        console.error("Error during upload:", error);
        alert("An error occurred while uploading the screenshot. Please try again.");
      } finally {
        setIsLoading(false); // Set loading state to false once the request is complete
      }
    }
  };

  const getDropdownOptions = () => {
    const options = [];

    if (Status === 'Invited') {
      options.push(
        <div key="invitedOptions">
          <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={confirmWithdraw}>
            Withdraw
          </li>
        </div>
      );
    }

    if (Status === 'cancelRequest') {
      options.push(
        <div key="queryOptions">
          <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleReport}>
            Report
          </li>
        </div>
      );
    }

    // Always add View Details option
    if (!(Status === 'Reviewing')) {
      options.push(
        <li key="viewDetails" className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleDetails}>
          View Details
        </li>
      );
    }

    options.push(
      <li key="message" className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
        Message
      </li>
    );

    if (Status === 'Reviewing') {
      options.push(
        <li key="review" className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={viewPosts} >
          View Posts
        </li>
      );
    }

    if (Status === 'LinkSubmitted') {
      options.push(
        <li key="links" className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={viewLinks} >
          View Links
        </li>
      );
    }

    if (Status === 'Accepted' || Status === 'Instructed') {
      options.push(
        <li key="cancel" className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleCancelContract}>
          Cancel
        </li>
      );
    }

    if (Status === 'Payment Pending') {
      options.push(
        <li key="uploadScreenshot" className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setShowPaymentOption(true);
            setShowDropdown(false)
          }
          }>
          Upload Screenshot
        </li>
      );
    }

    return options;
  };

  return (
    <div className="mt-5 relative">

      {showPaymentOption && (
        (totalSpending + budget < campaignBudget) ? (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">




            <div className='bg-white p-6 rounded-lg shadow-lg z-60 '>

              <h2 className="text-lg font-semibold mb-4">Pay and Upload Payment Screenshot</h2>
              <div className="">
                <div className="text-[14px] mt-5 ">
                  <p className="poppins-semibold text-[14px]">Account Number:</p>
                  <div className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50" rows="4" placeholder="Write something...">03058761739</div>
                </div>

                <div className="text-[14px]">
                  <p className="poppins-semibold text-[14px]">Account Number:</p>
                  <div className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50" rows="4" placeholder="Write something...">03058761739</div>
                </div>

                <div className="text-[14px]">
                  <p className="poppins-semibold text-[14px]">Bank Account Name:</p>
                  <div className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50" rows="4" placeholder="Write something...">Jazz cash</div>
                </div>


                <div className="text-[14px]">
                  <p className="poppins-semibold text-[14px]">Account Holder Name:</p>
                  <div className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50" rows="4" placeholder="Write something...">Ali Saif</div>
                </div>


                <div className="text-[14px]">
                  <p className="poppins-semibold text-[14px]">Payable Amount:</p>
                  <div className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50" rows="4" placeholder="Write something...">${budget}</div>
                </div>




                <div className="mb-4">
                  <label className="poppins-semibold text-[14px]">Upload Screenshot:</label>
                  <input
                    type="file"
                    className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                  />
                  {fileError && (
                    <p className="text-red-500 mt-2">Please upload a valid image file (PNG or JPG).</p>
                  )}
                </div>
                <div className="flex justify-end">


                </div>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-60">
                    <div className="text-white">Uploading, please wait...</div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <div className="bg-primary text-white  border-primary border-2 flex justify-center py-2 px-10 rounded-lg outline-[1]  mx-3 cursor-pointer" onClick={handleScreenShotSubmit}
                  disabled={isLoading}> {isLoading ? 'Uploading...' : 'Submit'}</div>
                <div className=" text-primary  border-primary border-2 flex justify-center py-2 px-4 rounded-lg outline-[1]  mx-3 cursor-pointer" onClick={() => setShowPaymentOption(false)}>Close</div>
              </div>
            </div>



          </div>
        ) : (
          alert(`You have ${campaignBudget - totalSpending} left in your campaign budget. Please adjust the budget.`)
        )
      )}

      {showLinks && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50  z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full ">
            <div className="flex justify-end mr-4 h-[20px] cursor-pointer" onClick={() => setShowLinks(false)}>
              <img src="/Svg/Close.svg" alt="Close" />
            </div>
            <p className="poppins-semibold text-[14px]">Link</p>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul>

                {instaMediaLinks.length > 0 ? (
                  instaMediaLinks.map((link, index) => (
                    <>

                      <div className='flex w-full'>

                        <div key={index} className="text-[14px] mt-2 flex   w-full space-x-2 items-center">
                          <input className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50 shrink-0" rows="4" placeholder="Write something..." value={link.postImageSrc}></input>
                        </div>
                        <a href={link.postImageSrc} className='mt-2' target='_blank'><img src="/Svg/Link.svg" alt="" className='mt-1' /></a>
                      </div>
                    </>
                    // <li key={index} className="text-blue-500 underline mb-2">
                    //   <a href={link.postImageSrc} target="_blank" rel="noopener noreferrer">
                    //     {link.postImageSrc}
                    //   </a>
                    // </li>
                  ))
                ) : (
                  <p>No links available for this contract.</p>
                )}
              </ul>
            )}

            {/* Approve Contract Button */}

            <div className="flex   justify-end gap-x-5  mt-5">
              <div className="bg-primary hover:bg-white hover:text-primary rounded-lg text-white justify-center flex text-center cursor-pointer w-[110px] items-center leading-[1px] py-5" onClick={approveContract}>
                <p>Approve</p>
              </div>
              <div className="border-primary border-[1px] text-primary hover:bg-white hover:text-primary rounded-lg justify-center flex text-center cursor-pointer w-[110px] items-center" onClick={() => setShowLinks(false)}>
                <p>  Close</p>
              </div>
            </div>



          </div>
        </div>
      )
      }

      {/* Confirmation Dialog */}
      {
        showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <p>Are you sure you want to withdraw this contract?</p>
              <div className="flex justify-end mt-4">

                <div className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg flex justify-center  mx-3 cursor-pointer" onClick={() => handleConfirmation(true)}>Send</div>
                <div className="w-full text-primary  border-primary border-2 flex justify-center py-2 px-4 rounded-lg outline-2  mx-3 cursor-pointer" onClick={() => handleConfirmation(false)}>Close</div>

              </div>
            </div>
          </div>
        )
      }

      {/* Query Report Modal */}
      {
        showQueryReportModal && (
          <QueryReportModal
            Id={contractID}
            isOpen={showQueryReportModal}
            onClose={() => setShowQueryReportModal(false)}
          />
        )
      }

      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center size-[50px] sm:size-[60px]">
          <img className="aspect-square Avatar" src={ImageSrc} alt="" />
        </div>

        <div className="flex-1 ml-6">
          <p className="poppins-semibold">{Name}</p>
          <p className="poppins-regular text-black/40">{age} years</p>
          <p>{bio.length > 30 ? `${bio.substring(0, 30)}...` : bio}</p>
        </div>

        <div className="w-[100px] sm:w-[140px] mdm:w-[160px] text-center">
          <p className={`${ColorBorder} cursor-pointer ${TextColor}`} style={{
    borderRadius: "1rem",
    borderWidth: "1px",
    paddingLeft: "0.75rem",
    paddingRight: "0.75rem",
    paddingTop: "0.25rem",
    paddingBottom:" 0.25rem",
    fontWeight: "400",
    fontStyle: "normal"}}>{Status}</p>
        </div>

        <div className="flex-shrink-0 ml-4 relative">
          <img
            src={more}
            alt="More"
            className="inline-block cursor-pointer"
            onClick={toggleDropdown}
          />

          {/* Contract Details Popup */}
          {showPopup && (
            <ContractDetails details={contractDetails} onClose={() => setShowPopup(false)} />
          )}

          {showPosts && (
            <PostModal setShowPosts={setShowPosts} posts={posts} handleApprove={handleApprove} setSelectedPostId={setSelectedPostId} setErrorMessage={setErrorMessage} />
            // <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            //   <div className="bg-white p-5 rounded shadow-lg max-w-screen-lg w-full" style={{ maxHeight: posts.length > 5 ? '400px' : 'auto', overflowY: 'auto' }}>
            //     <div className="flex justify-between items-center mb-4">
            //       <h2 className="text-lg font-bold">Posts</h2>
            //       <button onClick={() => setShowPosts(false)} className="text-gray-500 hover:text-gray-800">
            //         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            //         </svg>
            //       </button>
            //     </div>
            //     <div className="grid grid-cols-1 gap-4">
            //       {posts.length > 0 ? (
            //         posts.slice(0, 5).map(post => (
            //           <div key={post._id} className="flex flex-col items-center border p-2">
            //             <img src={post.imageLink} alt="Post" className="w-24 h-24 object-cover mb-2" />
            //             <p className="text-sm">{post.description}</p>
            //             <div className="flex mt-2">
            //               <button
            //                 className="bg-green-500 text-white px-2 py-1 rounded mr-2"
            //                 onClick={() => handleApprove(post._id)}>
            //                 Approve
            //               </button>
            //               <button
            //                 className="bg-blue-500 text-white px-2 py-1 rounded"
            //                 onClick={() => {
            //                   setSelectedPostId(post._id);
            //                   setErrorMessage(''); // Clear previous error message
            //                 }}>
            //                 Instruct
            //               </button>
            //             </div>
            //           </div>
            //         ))
            //       ) : (
            //         <p>No posts available.</p>
            //       )}
            //     </div>
            //     {selectedPostId && (
            //       <div className="mt-4">
            //         <input
            //           type="text"
            //           value={instruction}
            //           onChange={(e) => setInstruction(e.target.value)}
            //           placeholder="Enter instructions"
            //           className="border border-gray-300 p-2 rounded w-full"
            //         />
            //         <button
            //           onClick={handleInstruct}
            //           className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            //           Submit Instruction
            //         </button>
            //         {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            //       </div>
            //     )}
            //   </div>
            // </div>
          )}

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-[150px] bg-white border border-gray-200 shadow-lg rounded-lg z-10" ref={menuRef}>
              <ul className="py-1">
                {getDropdownOptions()}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Display success or error messages */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div >
  );
};

export default Dashboard;