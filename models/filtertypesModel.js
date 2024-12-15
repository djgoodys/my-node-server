const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the filtertype
const filtertypeSchema = new Schema({

type: {
    type: String,
    unique: true
},
trackable: {
    type: String
} 
});

// Create the model from the schema
const Filtertype = mongoose.model('Filtertype', filtertypeSchema);

module.exports = Filtertype;