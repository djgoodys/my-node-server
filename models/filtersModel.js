const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the filtertype
const filtersSchema = new Schema({
_id: {
    type: String
  },
filter_size: {
    type: String
},
filter_type: {
    type: String
},
filter_count: {
    type: Number
},
par: {
    type: Number
},
storage: {
    type: String
},
notes: {
    type: String
},
date_updated: {
    type: String
},
pn: {
    type: String
}
});

const Filters = mongoose.model('Filters', filtersSchema);

module.exports = Filters;