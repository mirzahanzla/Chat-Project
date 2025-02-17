import Report from '../models/Reports.js';

export const getReport = async (req, res) => {
  const { userName } = req.params;
  console.log("username in backend: ", userName);

  // Trim any leading/trailing spaces from the userName
  const trimmedUserName = userName.trim();

  try {
    // Find the report by either Name or fullName with a case-insensitive search
    const report = await Report.findOne({
      $or: [
        { Name: { $regex: new RegExp('^' + trimmedUserName + '$', 'i') } },
        { fullName: { $regex: new RegExp('^' + trimmedUserName + '$', 'i') } }
      ]
    });

    console.log("Report: ", report);
    
    // If no report is found, send a 404 response
    if (!report) {
      return res.status(404).json({ message: 'Report not found for this user' });
    }

    // Return the report
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error while fetching report' });
  }
};

export const addReport = async (req, res) => {
  const {
    Name,
    SumOfLikes,
    SumOfComments,
    SumOfEngagements,
    NoOfPosts,
    AvgEngagementRate,
    FollowerCount,
  } = req.body;

  try {
    // Validate required fields
    if (
      !Name ||
      SumOfLikes == null ||
      SumOfComments == null ||
      SumOfEngagements == null ||
      NoOfPosts == null ||
      AvgEngagementRate == null ||
      FollowerCount == null
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure values are valid (not zero or negative)
    if (
      SumOfLikes <= 0 ||
      SumOfComments <= 0 ||
      SumOfEngagements <= 0 ||
      NoOfPosts <= 0 ||
      AvgEngagementRate <= 0 ||
      FollowerCount <= 0
    ) {
      return res.status(400).json({ message: 'All values must be greater than zero' });
    }

    // Create a new report
    const newReport = new Report({
      Name,
      SumOfLikes,
      SumOfComments,
      SumOfEngagements,
      NoOfPosts,
      AvgEngagementRate,
      FollowerCount,
    });

    // Save the report to the database
    await newReport.save();

    res.status(201).json({ message: 'Report added successfully', report: newReport });
  } catch (error) {
    console.error('Error adding report:', error);
    res.status(500).json({ message: 'Server error while adding report' });
  }
};

export const updateReport = async (req, res) => {
  const { id } = req.params; // Assuming report ID is passed as a URL parameter
  const {
    Name,
    SumOfLikes,
    SumOfComments,
    SumOfEngagements,
    NoOfPosts,
    AvgEngagementRate,
    FollowerCount,
  } = req.body;

  try {
    // Validate required fields
    if (
      !Name ||
      SumOfLikes == null ||
      SumOfComments == null ||
      SumOfEngagements == null ||
      NoOfPosts == null ||
      AvgEngagementRate == null ||
      FollowerCount == null
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure values are valid (not zero or negative)
    if (
      SumOfLikes <= 0 ||
      SumOfComments <= 0 ||
      SumOfEngagements <= 0 ||
      NoOfPosts <= 0 ||
      AvgEngagementRate <= 0 ||
      FollowerCount <= 0
    ) {
      return res.status(400).json({ message: 'All values must be greater than zero' });
    }

    // Find the report by ID
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Update the report fields
    report.Name = Name;
    report.SumOfLikes = SumOfLikes;
    report.SumOfComments = SumOfComments;
    report.SumOfEngagements = SumOfEngagements;
    report.NoOfPosts = NoOfPosts;
    report.AvgEngagementRate = AvgEngagementRate;
    report.FollowerCount = FollowerCount;

    // Save the updated report to the database
    await report.save();

    res.status(200).json({ message: 'Report updated successfully', report });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Server error while updating report' });
  }
};

export const getReports = async (req, res) => {
  try {
    // Fetch the last two reports, sorted by creation date (most recent first)
    const reports = await Report.find()
      .sort({ createdAt: -1 })  // Sort by creation date in descending order (most recent first)
      .limit(2);  // Limit the result to the last 2 reports

    if (reports.length === 0) {
      return res.status(404).json({ message: 'No reports found' });
    }

    // Return the last two reports
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
};
