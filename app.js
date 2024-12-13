const express = require('express');
const app = express();
const apRoutes = require('./routes/ap'); // Adjust the path if needed

app.use(express.json());
app.use('/api', apRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  res.send(`Server is running on port ${PORT}`);
});

module.exports = app;
