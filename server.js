const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
const apiRoutes = require('./routes/ap.js');
require('./config/db.js');  // Import the db configuration to connect to MongoDB

app.use(express.json());
app.use(cors());  // Enable CORS for all routes

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

