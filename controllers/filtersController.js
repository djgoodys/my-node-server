const Filters= require('../models/filtersModel'); 
const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');  // Months are zero-based, so we add 1
  const day = String(today.getDate()).padStart(2, '0');
  return formatDateString(`${year}-${month}-${day}`);
};

async function manageFilters(req, res) {
  
  const action = req.query.action || req.body.action;
  const ID = req.query.id;
  switch(action){
    case "get-all-filters":
  try {
    const filters = await Filters.find({});
    //const units = filters.map(unit => unit.unit_name);
    //res.send("filters length="+ filters.length)
    res.json(filters);
  } catch (err) {
    res.status(500).send(err);
  }
break;

case "createFilters":
  try {
    const newFilters = new Filters(req.body);
    const savedFilters = await newFilters.save();
    res.status(201).json(savedFilters);
  } catch (error) {
    console.error('Error creating filters:', error);
    res.status(500).json({ message: error.message });
  }
break;

case "update-filter":
  const filter_size = req.query.size;
  const filter_type = req.query.filter_type;
  const filter_count = req.query.count;
   const par = req.query.par;
    const storage = req.query.storage;
  const notes = req.query.notes;
  const pn = req.query.pn;
  const today = getTodayDate();

  try {
    const filters = await Filters.findByIdAndUpdate(ID, {
        filter_size:filter_size,
        filter_type:filter_type,
        filter_count:filter_count,
        par:par,
        storage:storage,
        notes:notes,
        pn: pn,
        date_updated: today
    });
    if(!filters){res.send(`No filters found with id${ID}`);
    } else {
    const allfilters = await Filters.find({});
    res.json(allfilters);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
break;

case "delete-filter":

try {
  const deletedFilter = await Filters.findByIdAndDelete(ID);
  
  if (deletedFilter) {
    const allfilters = await Filters.find({});
    res.json(allfilters);
  } else {
    res.status(404).send(`Filter with id: ${ID} was not found`);
  }
} catch (err) {
  return res.status(500).send(err.message);
}

    break;


    case "getFilterById":
      try {
        const filters = await Filters.findById(ID);
        if (!filters) {
          return res.status(404).json({ message: 'Filter not found' });
        }
        res.json(filters);
      } catch (err) {
        res.status(500).send(err);
      }
      break;
  };

};

module.exports = {
  manageFilters
};
