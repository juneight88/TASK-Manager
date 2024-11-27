  const express = require('express');
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  const cors = require('cors');
  const taskRoutes = require('./routes/tasks');

  // Load environment variables
  dotenv.config();

  // Initialize Express app
  const app = express();
  const port = process.env.PORT || 5000;

  // Middleware
  app.use(express.json()); // Built-in body parser
  app.use(cors());

  // MongoDB Connection
  mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1);
    });

  // Routes
  app.use('/tasks', taskRoutes);

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
