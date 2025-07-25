const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('../routes/userRoutes')
const postRoutes = require('../routes/postRoutes')
const searchRoutes = require('../routes/searchRoutes')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB'ga ulanish
if (!mongoose.connection.readyState) {
	mongoose
		.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bgram')
		.then(() => console.log('✅ MongoDB ga muvaffaqiyatli ulandi!'))
		.catch(err => console.error('MongoDB ulanish xatosi:', err))
}

// Routes
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/search', searchRoutes)

// Vercel API Handler export
module.exports = app
module.exports.handler = (req, res) => app(req, res)
