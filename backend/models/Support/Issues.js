import mongoose from 'mongoose'
 const Schema = mongoose.Schema;



// Define the Issue schema
const issueSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User schema
        required: true,
    },
    issue: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Review', 'Resolved'],  // Ensure status has valid values
        required: true,
    },
    attachment: {
        type: String,  // Optional field for file path
        required: false,
    },
    contractLink: {
        type: String,  // Optional field for contract link
        required: false,
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Create the Issue model
const Issue = mongoose.model('Issue', issueSchema);

export {  Issue };

