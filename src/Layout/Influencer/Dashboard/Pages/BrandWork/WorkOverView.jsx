import { useState, useEffect } from 'react';
import axios from 'axios';
import WorkDetails from "./WorkDetails";

const WorkOverView = () => {

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const [totalPosts, setTotalPosts] = useState(0);
  const [newPosts, setNewPosts] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState("$0");
  const [draftContent, setDraftContent] = useState(0);
  const [revisionRequests, setRevisionRequests] = useState(0);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get('/api/getUserContracts', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
  
        // Destructure data and message from the response
        const { data, message } = response.data;
  
        if (response.status === 200) {
          if (data && data.length === 0) {
            setMessage('You have no contracts yet.');
            setContracts([]);
            setTotalPosts(0);
            setNewPosts(0);
            setTotalEarnings("$0");
            setDraftContent(0);
            setRevisionRequests(0);
          } else {
            setContracts(data);
  
            let totalPostsCount = 0;
            let newPostsCount = 0;
            let totalEarningsCount = 0;
            let draftContentCount = 0;
            let revisionRequestsCount = 0;
  
            // Process contracts
            data.forEach(contract => {
              if (contract.milestones && Array.isArray(contract.milestones)) {
                contract.milestones.forEach(milestone => {
                  const { posts, status, budget, postLinks } = milestone;
  
                  // Total Posts Calculation
                  totalPostsCount += posts;
  
                  // New Posts Calculation (status is 'Pending')
                  if (status === 'Accepted') {
                    newPostsCount += posts;
                  }
  
                  // Total Earnings Calculation
                  if (status === 'Approved') {
                    totalEarningsCount += budget;
                  }
  
                  // Draft Content Calculation
                  if (status === 'Draft') {
                    draftContentCount += postLinks.length;
                    newPostsCount += posts - postLinks.length;
                  }
  
                  // Revision Requests Calculation
                  if (status === 'Revision') {
                    revisionRequestsCount += posts;
                  }
                });
              }
            });
  
            // Update state with computed values
            setTotalPosts(totalPostsCount);
            setNewPosts(newPostsCount);
            setTotalEarnings(`$${totalEarningsCount}`);
            setDraftContent(draftContentCount);
            setRevisionRequests(revisionRequestsCount);
            setMessage('');
          }
        } else {
          setError('Failed to fetch contracts.');
        }
      } catch (err) {
        console.error('Error fetching contracts:', err);
        setError('Error loading contracts.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchContracts();
  }, []);  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (message) return <p>{message}</p>;

  return (
    <>
      <div className="mt-10">
        <div className="mx-10 mt-2 grid gap-y-4 grid-cols-2 grid-rows-3 xs:grid-cols-3 xs:grid-rows-2 md:grid-cols-6 md:grid-rows-1 justify-center items-center">
          <SimpleCard name="Total Contracts" digit={contracts.length} />
          <SimpleCard name="Total Posts" digit={totalPosts} />
          <SimpleCard name="Pending Posts" digit={newPosts} />
          <SimpleCard name="Career Earnings" digit={totalEarnings} />
          <SimpleCard name="Draft Content" digit={draftContent} />
          <SimpleCard name="Revisions" digit={revisionRequests} />
        </div>

        <WorkDetails contracts={contracts} />
      </div>
    </>
  );
};

const SimpleCard = ({ name, digit }) => {
  return (
    <div className="text-[10px] w-[100px] h-[80px] mdm:w-[120px] mdm:h-[80px] bg-white rounded-2xl flex flex-col OverViewBox1 justify-self-center">
      <div className="px-3 py-1 mdm:py-2 lato-regular">
        <p className="lato-regular text-[14px]">{name}</p>
        <p className="text-sm mdm:text-[12px]">{digit}</p>
      </div>
    </div>
  );
};

export default WorkOverView;