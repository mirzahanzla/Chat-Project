import { useState, useRef, useEffect } from 'react';

const UpdateReport2 = ({ rowData, onClose }) => {


  if (!rowData) return null;

  console.log('Row data us ')
  console.log(rowData)



  return (
    <>

      <div className="fixed inset-0  flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-4 rounded-lg w-[300px] md:w-[500px]">
          <img
            src="/Svg/Close.svg"
            alt="Close"
            className="cursor-pointer ml-auto size-[20px]"
            onClick={onClose}
          />
          {/* add herer */}
          <UpdateReport rowData={rowData} />
          {/* end here */}
        </div>
      </div>

    </>
  );
};



const UpdateReport = ({ rowData }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [name, setName] = useState('');
  const [sumOfLikes, setSumOfLikes] = useState('');
  const [sumOfComments, setSumOfComments] = useState('');
  const [sumOfEngagements, setSumOfEngagements] = useState('');
  const [noOfPosts, setNoOfPosts] = useState('');
  const [avgEngagementRate, setAvgEngagementRate] = useState('');
  const [followerCount, setFollowerCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Handle report selection
  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setName(report.Name);
    setSumOfLikes(report.SumOfLikes);
    setSumOfComments(report.SumOfComments);
    setSumOfEngagements(report.SumOfEngagements);
    setNoOfPosts(report.NoOfPosts);
    setAvgEngagementRate(report.AvgEngagementRate);
    setFollowerCount(report.FollowerCount);
  };

  useEffect(() => {
    handleSelectReport(rowData);
  }, [rowData]);

  // Handle updating the selected report
  const handleUpdateReport = async (e) => {
    e.preventDefault();

    // Validate the form
    if (
      !name ||
      !sumOfLikes ||
      !sumOfComments ||
      !sumOfEngagements ||
      !noOfPosts ||
      !avgEngagementRate ||
      !followerCount
    ) {
      setStatus('Please fill in all the fields before submitting the report.');
      return;
    }

    if (
      sumOfLikes <= 0 ||
      sumOfComments <= 0 ||
      sumOfEngagements <= 0 ||
      noOfPosts <= 0 ||
      avgEngagementRate <= 0 ||
      followerCount <= 0
    ) {
      setStatus('All values must be greater than zero.');
      return;
    }

    setLoading(true);
    setStatus(null);

    const reportData = {
      Name: name,
      SumOfLikes: parseInt(sumOfLikes),
      SumOfComments: parseInt(sumOfComments),
      SumOfEngagements: parseInt(sumOfEngagements),
      NoOfPosts: parseInt(noOfPosts),
      AvgEngagementRate: parseFloat(avgEngagementRate),
      FollowerCount: parseInt(followerCount),
    };

    try {
      const response = await fetch(`/report/modifyReport/${selectedReport._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      setStatus('Report updated successfully!');
    } catch (error) {
      console.error('Error updating report:', error);
      setStatus('Failed to update report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 rounded-xl">
      {selectedReport && (
        <form onSubmit={handleUpdateReport} className="col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="sumOfLikes">
              Sum of Likes
            </label>
            <input
              type="number"
              id="sumOfLikes"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter sum of likes"
              value={sumOfLikes}
              onChange={(e) => setSumOfLikes(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="sumOfComments">
              Sum of Comments
            </label>
            <input
              type="number"
              id="sumOfComments"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter sum of comments"
              value={sumOfComments}
              onChange={(e) => setSumOfComments(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="sumOfEngagements">
              Sum of Engagements
            </label>
            <input
              type="number"
              id="sumOfEngagements"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter sum of engagements"
              value={sumOfEngagements}
              onChange={(e) => setSumOfEngagements(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="noOfPosts">
              Number of Posts
            </label>
            <input
              type="number"
              id="noOfPosts"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter number of posts"
              value={noOfPosts}
              onChange={(e) => setNoOfPosts(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="avgEngagementRate">
              Average Engagement Rate
            </label>
            <input
              type="number"
              step="any"
              id="avgEngagementRate"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter average engagement rate"
              value={avgEngagementRate}
              onChange={(e) => setAvgEngagementRate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="followerCount">
              Follower Count
            </label>
            <input
              type="number"
              id="followerCount"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter follower count"
              value={followerCount}
              onChange={(e) => setFollowerCount(e.target.value)}
              required
            />
          </div>

          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]"
            >
              {loading ? 'Updating Report...' : 'Update Report'}
            </button>
          </div>
        </form>
      )}

      {status && (
        <div
          className={`col-span-2 mt-5 p-4 rounded-lg ${status.includes('successfully')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}
        >
          {status}
        </div>
      )}
    </div>
  );
};


export default UpdateReport2;
