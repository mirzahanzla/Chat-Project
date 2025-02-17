import mongoose from 'mongoose';

const mongoUri = 'mongodb+srv://alisaif2617:Ali11297@fyp.you7dai.mongodb.net/influencerHarbor?retryWrites=true&w=majority&appName=fyp';
// const mongoUri = 'mongodb://localhost:27017/fyp';
// const mongoUri = 'mongodb+srv://sabirrizwan321:vrKhbsCvg1Sj4gBI@cluster0.q3akg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));
  