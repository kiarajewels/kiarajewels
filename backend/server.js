const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://www.kiarajewels.co',
  'https://kiarajewels.co',
  'https://admin.kiarajewels.co'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/payment', require('./routes/payment'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/custom-orders', require('./routes/customOrders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/returns', require('./routes/returns'));
app.use('/api/cron', require('./routes/cron'));

app.get('/', (req, res) => {
  res.send('Kiara Jewels API is running...');
});

// Start local cron jobs only if not deployed on Vercel (Vercel uses /api/cron endpoint instead)
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  require('./jobs/reviewEmailJob');
}
// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kiarajewels')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Export the app for Vercel Serverless
module.exports = app;

if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Actually listening on:`, server.address());
  });
}
