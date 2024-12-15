const Filtertype = require('../models/filtertypesModel');

async function manageFilterTypes(req, res) {

  const action = req.query.action || req.body.action;
  const ID = req.query.id || req.body.id;
  let filtertypes = {};
  switch (action) {
    case "get-all-filter-types":
      try {
        filtertypes = await Filtertype.find({});
        res.json(filtertypes);
      } catch (err) {
        res.status(500).send(err);
      }
      break;

    case "getFiltertypesById":
      try {
        filtertypes = await Filtertype.findById(ID);
        if (!filtertypes) {
          return res.status(404).json({ message: 'Filtertype not found' });
        }
        res.json(filtertypes);
      } catch (err) {
        res.status(500).send(err);
      }
      break;

    case "createFiltertypes":
      try {
        const { type, trackable } = req.query;
        const newFiltertype = new Filtertype({
          type: type,
          trackable: trackable
        });
        const savedFiltertype = await newFiltertype.save();
        filtertypes = await Filtertype.find({});
        res.json(filtertypes);
      } catch (error) {
        console.error('Error creating filtertypes:', error);
        res.status(500).json({ message: error.message });
      }
      break;

    case "update-filtertype":
      const ID = req.params.id;
      try {
        filtertypes = await Filtertype.findByIdAndUpdate(ID, req.body, { new: true });
        if (!filtertypes) {
          return res.status(404).json({ message: 'Filtertype not found' });
        }
        res.json(filtertypes);
      } catch (err) {
        return res.status(500).send(err);
      }
      break;


    case "deleteFiltertypes":
      try {
        if (!ID) {
          return res.status(400).send('ID is required');
        }
        await Filtertype.findByIdAndDelete(ID);
        const filtertypes = await Filtertype.find({});
        res.json(filtertypes);
      } catch (err) {
        res.status(500).send(err.message);
      }

      break;
  }
}
module.exports = {
  manageFilterTypes
};
