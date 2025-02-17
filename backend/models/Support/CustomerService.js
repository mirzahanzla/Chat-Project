import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const customerServiceSchema = new Schema({
    name: {
        type: String,
        default: 'Support Service', // Default value for name
        required: true,
    },
    image: {
        type: String, // Optional field for storing the image path or URL
        required: false,
    },
    customerServiceID: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Hash the password before saving the document
customerServiceSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare entered password with hashed password
customerServiceSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const CustomerService = mongoose.model('CustomerService', customerServiceSchema);

export default CustomerService;
