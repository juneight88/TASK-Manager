  const express = require('express');
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  const cors = require('cors');
  const taskRoutes = require('./routes/tasks');

 
  dotenv.config();


  const app = express();
  const port = process.env.PORT || 5000;


  app.use(express.json()); 
  app.use(cors());


  mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1);
    });


  app.use('/tasks', taskRoutes);


  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
