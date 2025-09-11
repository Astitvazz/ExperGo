const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectToDb = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); 

// Connect to Database
connectToDb();

// Root route
app.get('/', (req, res) => {
  res.send('<h1>BubbleBlog</h1>');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comment', commentRoutes);

// File upload route (keeping it here as it's general purpose)
app.post('/uploadSingle', require('./middleware/upload').single('singleFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: 'File uploaded to Cloudinary successfully!',
    url: req.file.path,
    public_id: req.file.filename
  });
});

// Start server
app.listen(port, () => {
  console.log(`BubbleBlog server listening on port ${port}`);
});