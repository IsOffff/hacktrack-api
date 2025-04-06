const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const hackathonRoutes = require('./routes/hackathons');
const teamRoutes = require('./routes/teams');
const { authMiddleware } = require('./middleware/authMiddleware');
const redoc = require('redoc-express');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/hackathons', authMiddleware, hackathonRoutes);
app.use('/teams', teamRoutes);

app.get(
  '/docs',
  redoc({
    title: 'HackTrack API Docs',
    specUrl: '/openapi.yaml',
  })
);

app.listen(3002, () => {
  console.log('Server is running on http://localhost:3002');
});