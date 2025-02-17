import mongoose from "mongoose";

// Schema for IssueStatistics
const issueStatisticsSchema = new mongoose.Schema({
    Contract: {
        type: Number,
        required: true
    },
    Payment: {
        type: Number,
        required: true
    },
    Account: {
        type: Number,
        required: true
    },
    Others: {
        type: Number,
        required: true
    },
    Pending: {
        type: Number,
        required: true
    },
    Resolved: {
        type: Number,
        required: true
    },
    Progress: {
        type: Number,
        required: true
    } ,
    month: { type: String, required: true }, // e.g., "2024-11"
    createdAt: { type: Date, default: Date.now },
});

issueStatisticsSchema.pre("save", function (next) {
    if (!this.month) {
        const createdDate = this.createdAt || new Date();
        this.month = createdDate.toISOString().slice(0, 7); // Format: "YYYY-MM"
    }
    next();
});


// Creating Models
const IssueStatistics = mongoose.model('SupportStatistics', issueStatisticsSchema);

export default IssueStatistics
