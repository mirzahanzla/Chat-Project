import { DropdownSvg } from '../../../../../Components/Svg/DropDownSvg';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Media from './Media';
import { useNavigate } from 'react-router-dom';

const WorkContent = () => {
  const navItems = ['All', 'Pending', 'Revision', 'Approved', 'Drafted'];
  const [contractID, setContractID] = useState();
  const [status, setStatus] = useState();
  const [milestones, setMilestones] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // New state for modal visibility
  const [postLinks, setPostLinks] = useState([]);    // New state for post links
  const [error, setError] = useState(null);          // New state for error handling
  const navigate = useNavigate();

  const location = useLocation();
  const { proposalID } = location.state || {};

  useEffect(() => {
    if (proposalID) {
      console.log("Proposal id is : ", proposalID);
      const fetchData = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            throw new Error('Authentication token is missing.');
          }

          const response = await axios.get(`/api/getContractByProposalID?proposalID=${proposalID}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });

          const contractsData = response.data;
          setContractID(contractsData[0]._id);
          setStatus(contractsData[0].milestones[contractsData[0].milestones.length - 1].status);

          let totalPostsCount = 0;
          let milestonesCount = 0;

          contractsData.forEach(contract => {
            milestonesCount += contract.milestones.length;
            contract.milestones.forEach(milestone => {
              totalPostsCount += milestone.posts;
            });
          });

          setTotalPosts(totalPostsCount);
          setMilestones(milestonesCount);
          setPostLinks(Array(totalPostsCount).fill(''));
        } catch (error) {
          setError(error.response ? error.response.data : 'Error loading contracts');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [proposalID]);

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...postLinks];
    updatedLinks[index] = value;
    setPostLinks(updatedLinks);
  };

  const isValidInstagramLink = (link) => {
    const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/;
    return instagramRegex.test(link);
  };

  const handleSubmitLinks = async () => {
    for (let i = 0; i < postLinks.length; i++) {
      if (!postLinks[i]) {
        setError(`Link ${i + 1} is empty. Please enter a valid Instagram link.`);
        return;
      }
      if (!isValidInstagramLink(postLinks[i])) {
        setError(`Link ${i + 1} is not a valid Instagram link. Please enter a valid URL.`);
        return;
      }
    }

    try {
      const response = await axios.post('/api/submitInstaLinks', {
        contractID,
        links: postLinks
      });

      console.log('Submit Links Response:', response.data);
      setShowModal(false);
      navigate(-1);
    } catch (error) {
      setError('Failed to submit links. Please try again.');
      console.error('Error submitting links:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="mx-2 xs:ml-10 pt-5 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[10px]">
        <div className="flex gap-x-3 items-center">
          <img src="/Svg/BackButton.svg" alt="" />
          <p className="text-black/50 poppins-semibold">Back</p>
        </div>

        <div className="mt-5 ml-10">
          <p className="text-lg poppins-semibold">Content</p>
        </div>

        <div className="xs:mx-10 mt-2 lg:w-[600px] grid grid-cols-2 md:grid-cols-4 grid-rows-2 sm:grid-rows-1 gap-x-3 justify-items-center items-center">
          <SimpleCard newPosts={`${totalPosts} Posts Required`} bg="BlueButtonWithText-v2" />
          <SimpleCard newPosts={`${milestones} Milestones Pending`} bg="OrangeButtonBorder-v2" />

         

          {status === 'submitLink' && (
            <div className="flex justify-end col-span-2 md:col-span-1 row-start-1 row-end-1">
              <button
                className="bg-primary text-white py-2 px-4 rounded"
                onClick={() => setShowModal(true)}
              >
                Submit
              </button>
            </div>
          )}
        </div>

      <div className='flex justify-between'>
      <div className="flex justify-start mt-5 ml-10 gap-x-3">
          <Dropdown key={1} items={navItems} initialValue="All" />
        </div>
        {status === 'Awaiting InstaLink' && (
            <div className="flex col-span-2 md:col-span-1 ">
              <div
                className=" w-[120px] h-[50px]  poppins-regular mdm:w-[130px] mdm:h-[50px] rounded-2xl flex justify-center items-center OverViewBox1 bg-primary  text-white  text-[12px] tracking-[-0.02px]"
                onClick={() => setShowModal(true)}
              >
                Submit Links
              </div>
            </div>
          )}
      </div>

        <Media status={status} contractID={contractID} totalPosts={totalPosts} />

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50  z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full ">
            <div className="flex justify-end mr-4 h-[20px] cursor-pointer " >
            <img src="/Svg/Close.svg" alt="Close"    onClick={() => setShowModal(false)} />
          </div>
          <h2 className="text-2xl  mb-4">Submit Instagram Post Links</h2>
              <h2 className="text-lg font-bold mb-4"></h2>

             

              {postLinks.map((link, index) => (
                <div key={index} className="mb-4">
                   <p className="text-gray-600 mb-2 text-[14px] ">
                   Instagram Post Link  </p>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 rounded w-full "
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder={`Enter Instagram post link for post ${index + 1}`}
                  />
                </div>
              ))}

              {error && <p className="text-red-500">{error}</p>}

              
              <div className="flex justify-end mt-6 space-x-5">
              <div
                  className="bg-primary text-white py-2 px-4 rounded"
                  onClick={handleSubmitLinks}
                >
                  Submit
                </div>
                <div
                  className="bg-white border-primary border-[1px] text-primary py-2 px-4 rounded mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </div>
               
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const SimpleCard = ({ bg, newPosts = "" }) => {
  return (
    <div className={`${bg} w-[120px] h-[50px] mdm:w-[130px] mdm:h-[50px] rounded-2xl flex justify-center items-center OverViewBox1 bg-white`}>
      <div className="mdm:py-2 lato-regular">
        <p className="text-[10px]">{newPosts}</p>
      </div>
    </div>
  );
};

const Dropdown = ({ items, initialValue }) => {
  const [isOpen, setIsOpen] = useState([0, initialValue]);

  return (
    <div className="flex items-center flex-col poppins-semibold rounded-xl bg-white relative text-[9px] xs:text-[10px] sm:text-[13px] md:text-[12px]">
      <div
        className="px-2  sm:p-2 flex justify-between w-[100px] sm:w-[120px] items-center relative h-full"
        onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}
      >
        <div>{isOpen[1]}</div>
        <DropdownSvg />
      </div>
      {isOpen[0] ? (
        <ul className="poppins-regular flex gap-y-2 flex-col mt-2 absolute top-10 bg-white w-full p-2 rounded-xl">
          {items.map((item, index) =>
            isOpen[1] !== item ? (
              <li key={index} className="dropdown-item" onClick={() => setIsOpen([0, item])}>
                {item}
              </li>
            ) : null
          )}
        </ul>
      ):""}
    </div>
  );
};

export default WorkContent;
