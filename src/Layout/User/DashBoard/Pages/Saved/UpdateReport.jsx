import { useState, useEffect } from 'react';

const UpdateReport = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
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
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch reports from the API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/report/getReports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data);
        setFilteredReports(data); // Initialize filteredReports with all reports
      } catch (error) {
        console.error('Error fetching reports:', error);
        setStatus('Failed to load reports.');
      }
    };

    fetchReports();
  }, []);

  // Filter reports based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(
        reports.filter((report) =>
          report.Name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, reports]);

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
    <div className="bg-gray-100 p-5 rounded-xl">
      <h3 className="text-xl font-bold mb-4">Update Report</h3>
      <input
        type="text"
        placeholder="Search here"
        className="flex w-[200px] sm:w-[300px] rounded-2xl h-8 md:h-10 border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Select Report to Modify:</h4>
        <ul className="list-none space-y-2">
          {filteredReports.map((report, index) => (
            <li key={report.id} className="border-b pb-2">
              <div
                className=""
                onClick={() => handleSelectReport(report)}
              >
                {index + 1}) {report.Name}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedReport && (
        <form onSubmit={handleUpdateReport} className="space-y-4">
          {/* Form Inputs */}
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
          {/* Similar for other fields */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            {loading ? 'Updating Report...' : 'Update Report'}
          </button>
        </form>
      )}

      {status && (
        <div
          className={`mt-5 p-4 rounded-lg ${
            status.includes('successfully')
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

export default UpdateReport;
