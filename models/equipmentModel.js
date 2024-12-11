const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the equipment
const equipmentSchema = new Schema({
    _id: {
       //can't everide default _id from mongoose
    },
    unit_name: {
        type: String,
        unique: true
    },
    location: {
        type: String,
    },
    area_served: {
        type: String,
    }, 
    filter_size:{
        type: String,
    },
    filters_due: {
        type: String,
    },
    belts: {
        type:String,
    },
    notes: {
        type:String,
    },
    filter_rotation: {
        type:String
    },
    filter_type: {
        type:String,
    },
    filters_last_changed:{
        type:String,
    },
    assigned_to: {
        type:String,
    },
     image: {
        type:String,
    },
    filter_type:{
        type:String,
    }
});

// Create the model from the schema
const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
