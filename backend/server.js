const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const PostRoutes = require('./router/PostRouter');
const authRoutes = require('./router/authRouter.js');
//const {errorHandler} = require('./middleware/errorMiddleware.js');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
app.use('/api/posts', PostRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use(errorHandler);

mongoose.connect(process.env.Database_uri)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.log("❌ Error connecting to MongoDB:", err));

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});