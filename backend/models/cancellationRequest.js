import mongoose from 'mongoose';

const cancellationRequestSchema = new mongoose.Schema({
    contractID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Contract' },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'AutoCancelled'],  // Enum for status values
        default: 'Pending'
    }
});

export default mongoose.model('CancellationRequest', cancellationRequestSchema);