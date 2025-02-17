import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  brandID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  brandName: { type: String, required: true },
  brandImage: { type: String, required: true },
  deals: [{
    dealID: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }
  }],
  network: [{
    influencerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true}
  }]
});

export default mongoose.model('Brand', brandSchema);