const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://admin:LdO87Q6bJb8364Gq@cluster0.ywawave.mongodb.net/kiara?retryWrites=true&w=majority';

mongoose.connect(mongoURI).then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('products').updateMany({ category: 'Necklaces' }, { $set: { category: 'Pendants' } });
  console.log('Updated', result.modifiedCount, 'products');
  mongoose.disconnect();
}).catch(console.error);
