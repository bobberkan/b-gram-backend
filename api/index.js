const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('../routes/userRoutes');
const postRoutes = require('../routes/postRoutes');

dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('MongoDB Connected'))
      .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = (req, res) => {
    app(req, res);
};
