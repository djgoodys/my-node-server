const Filtertype = require('../models/filtertypesModel'); 

async function manageFilterTypes(req, res) {

  const action = req.query.action || req.body.action;
  const ID = req.query.id;
switch(action){
  case "get-all-filter-types":
  try {
    const filtertypes = await Filtertype.find({});
    //const units = filtertypes.map(unit => unit.unit_name);
    //res.send("filtertypes length="+ filtertypes.length)
    res.json(filtertypes);
  } catch (err) {
    res.status(500).send(err);
  }
break;

case "getFiltertypesById":
  try {
    const filtertypes = await Filtertype.findById(ID);
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
    const newFiltertypes = new Filtertype(req.body);
    const savedFiltertypes = await newFiltertypes.save();
    res.status(201).json(savedFiltertypes);
  } catch (error) {
    console.error('Error creating filtertypes:', error);
    res.status(500).json({ message: error.message });
  }
  break;

case "update-filtertype":
  const ID = req.params.id;
  try {
    const filtertypes = await Filtertype.findByIdAndUpdate(ID, req.body, { new: true });
    if (!filtertypes) {
      return res.status(404).json({ message: 'Filtertype not found' });
    }
    res.json(filtertypes);
  } catch (err) {
    return res.status(500).send(err);
  }
  break;


case "deleteFiltertypes":
  Filtertype.findByIdAndRemove(ID, (err, filtertypes) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Filtertype successfully deleted', filtertypes });
  });
  break;
}
}
module.exports = {
  manageFilterTypes
};
