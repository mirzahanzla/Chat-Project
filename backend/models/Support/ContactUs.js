// Define a Mongoose schema and model
import mongoose from 'mongoose';


const contactSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ContactUs = mongoose.model('ContactUs', contactSchema);

export default ContactUs;