const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storagesSchema = new Schema({
_id: {
    type: String
},
location: {
    type: String
}
});

const Storages = mongoose.model('Storages', storagesSchema);

module.exports = Storages;