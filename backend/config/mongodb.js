import mongoose from 'mongoose';



mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));
  