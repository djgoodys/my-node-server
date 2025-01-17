const Equipment = require('../models/equipmentModel'); 

async function manageEquipment(req, res) {
  const action = req.query.action;
  const newtasks = req.query.newtasks;
  const username = req.query.username;
  const unitId = req.query.unit_id || req.body.unit_id;
  const rotation = req.query.rotation || req.body.rotation;
  const unit_name = req.query.unit_name;
  const location = req.query.location;
  const area_served = req.query.area_served;
  const filter_size = req.query.filter_size;
  const filters_due = req.query.filters_due;
  const belts = req.query.belts;
  const notes = req.query.notes;
  const filter_type = req.query.filter_types;
  const image = req.query.image;
  const assigned_to = req.query.assigned_to;
  let tasks;
  let equipment;

  const isGreaterThanDaysInMonth = (month, year, number) => {
    // Array with the number of days in each month, starting from January
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
    // Check for leap year and adjust February days
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
      daysInMonth[1] = 29;  // Adjust February for leap year
    }
  
    // Get the total days in the specified month
    const totalDays = daysInMonth[month - 1];  // Adjust month from 1-based to 0-based index
  
    // Return whether the number is greater than the total days in the month
    return number > totalDays;
  };
  
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

  const getLastDayOfMonth = (month, year) => {
    month = Number(month);
    year = Number(year);
    return new Date(year, month, 0).getDate();
  };

  const getFilterDueDate = (rotation) => {
    const date = new Date(); // Today's date

// Add 3 months
date.setMonth(date.getMonth() + 3); 

    const today = new Date();
    const futureDate = new Date(today.setMonth(today.getMonth() + rotation));
    
    // Format the date as Y-m-d
    const year = date.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(futureDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  
  if (Array.isArray(newtasks)) {
    tasks = newtasks;
  } else if (newtasks) {
    tasks = newtasks.split(",");  
  } else {
    tasks = [];
  }

  switch(action){
    case "get-all-equipment":
      let equipmentWithFilters = await Equipment.aggregate([
        {
          $lookup: {
            from: 'filters',
            localField: 'filter_id', // Field in Equipment
            foreignField: '_id', // Field in Filters
            as: 'filterDetails' // Name of the array to add the results
          }
        }
      ]);
      res.json(equipmentWithFilters);
      
      
      break;
      
      case "add-all-tasks":
        tasks.forEach(async (thistask) => {
          try {
            equipment = await Equipment.findByIdAndUpdate(
              thistask,  
              { assigned_to: username }
            );

          } catch (error) {
            console.error(`Error updating equipment with ID ${thistask[i]}:`, error);
          }
        });
      break;

      case "filtersdone":
        try {
          const date = new Date();
          let newday = '';
          let dueyear = date.getFullYear().toString();
          let dueday = date.getDate().toString();
          let duemonth;
          let totalmonths = 0;
          let numMonths = date.getMonth(date) + Number(rotation);
          let rotmonths, rotyears;
          if(numMonths > 12) {
            rotyears = Math.floor(numMonths / 12);
            dueyear = rotyears + Number(dueyear);
            totalmonths = Number(rotation) + (date.getMonth() + 1);
           duemonth = totalmonths % 12;
            if(isGreaterThanDaysInMonth(duemonth, dueyear, dueday)){
              dueday = getLastDayOfMonth(duemonth, dueyear)
            }
          }

          const nextduedate = dueyear +"-"+ duemonth +"-" + dueday;
          const lastChanged = "["+ username + "]" + getTodayDate();
          
          equipment = await Equipment.findByIdAndUpdate(
            unitId, 
            { assigned_to: '',
              filters_last_changed: lastChanged,
              filters_due: nextduedate
             }
          );

        } catch (error) {
          console.error(`Error updating equipment with ID ${unitId}:`, error);
        }
        const updatedequipment = await Equipment.find({});
        res.json(updatedequipment);

    break;

      case "assigned_too":
      equipment = await Equipment.findByIdAndUpdate(
        unitId,  // Ensure you're accessing the correct ID
        { assigned_to: username }, {new:true}
      );

      case "get-overdue":
        try {
          let today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0'); 
          const day = String(today.getDate()).padStart(2, '0'); 
          today = `${year}-${month}-${day}`;
          console.log("today="+today);
          equipment = await Equipment.find({filters_due: {$lt:  today}});
          res.json(equipment);
        } catch (err) {
          res.status(500).send(err);
        }
        break;

      case "sort":
          if(req.query.sortby === "today"){
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const dd = String(today.getDate()).padStart(2, '0');
            const formattedToday = `${yyyy}-${mm}-${dd}`;
            console.log("formattedToday="+formattedToday);
            equipment = await Equipment.find({filters_due: formattedToday});
            res.json(equipment);
          }
          if(req.query.sortby === "NORMAL"){
            const today = new Date();
            equipment = await Equipment.find({});
            res.json(equipment);
          }
          if (req.query.sortby == '1' || req.query.sortby == "-1") {
          let sortby = parseInt(req.query.sortby, 10);
          equipment = await Equipment.find({}).sort({filters_due:sortby});
          res.json(equipment);
        }
    
        break;

      case "search":
        const searchwords = req.query.searchwords;
        const regex = new RegExp(searchwords, 'i'); 

        const filtered_equipment = await Equipment.find({
          $or: [
            { id: { $regex: regex } },
            { unit_name: { $regex: regex } },
            { location: { $regex: regex } },
            { area_served: { $regex: regex } },
            { filter_size: { $regex: regex } },
            { filters_due: { $regex: regex } },
            { belts: { $regex: regex } },
            { notes: { $regex: regex } },
            { storage: { $regex: regex } },
            { filter_rotation: { $regex: regex } },
            { filters_last_changed: { $regex: regex } },
            { assigned_to: { $regex: regex } },
            { image: { $regex: regex}}
          ]
        });

        if(filtered_equipment){
          res.json(filtered_equipment);
        } else {
          res.send(`No units found with searchwords${searchwords}`);
        }

      break;

      case "edit-unit":
        equipment = await Equipment.findByIdAndUpdate(
          unitId, 
          { 
            assigned_to: assigned_to,
            unit_name: unit_name,
            rotation : rotation,
            location : location,
            area_served : area_served,
            filter_size : filter_size,
            filters_due : filters_due,
            belts : belts,
            notes : notes,
            filter_type : filter_type,
            image : image
          }
        );
        if(equipment){
          equipment = await Equipment.find({});
        res.json(equipment);
        }
        else{
          res.send("404 unit with id:"+ unitId + " was not found")
        }
        break;

      case "delete-unit":
        equipment = await Equipment.findByIdAndDelete(unitId)
        if(!equipment){
          res.send(unitId + " was not found")
        }else{
        equipment = await Equipment.find({});
        res.json(equipment);
        break;
        }
  }
 
}


const createEquipment = async (req, res) => {
  try {
    const newEquipment = new Equipment(req.body);
    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  manageEquipment
};
