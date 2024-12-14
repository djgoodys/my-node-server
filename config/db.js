const mongoose = require('mongoose');

const dbURI2 = "mongodb+srv://djgoodys:relays82@fmdb-cluster.4c2dt.mongodb.net/fmdb?retryWrites=true&w=majority&appName=fmdb-cluster";
const dbURI = "mongodb+srv://djgoodys:relays82@fmdb-cluster.4c2dt.mongodb.net/fmdb-cluster-shard-00-01.4c2dt.mongodb.net:27017";
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected');
    app.get('/check-connection', (req, res) => {
      res.json({ status: 'success', message: 'MongoDB connected successfully!' });
    });
    console.log("respone="+req.body || req.query)
  })
  

    
.catch((err) => console.error('MongoDB connection error:', err));
