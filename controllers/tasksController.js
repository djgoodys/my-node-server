const Equipment = require('../models/equipmentModel'); 
async function manageTasks(req, res) {
    const action = req.query.action;
    const id = req.query.unit_id;
    const rotation  = req.query.rotation;
    const username = req.query.username;
    let tasks = [];

    const isGreaterThanDaysInMonth = (month, year, number) => {
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
          daysInMonth[1] = 29;  // Adjust February for leap year
        }
        const totalDays = daysInMonth[month - 1]; 
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

      
    switch (action){
        case "get-all-tasks":
            try 
                {
                    tasks = await Equipment.find({ assigned_to: 'dj' });
                    res.json(tasks);
                } catch (err) {
                    res.status(500).send(err);
                }
            break;
        case "cancel-task":
            const task = await Equipment.findByIdAndUpdate(
                id, 
                { assigned_to: '' }
            )
            tasks = await Equipment.find({ assigned_to: 'dj' });
            res.json(tasks);
            break;

        case "complete-task":
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
          const filter_type = req.query.filter_type;
          const equipment = await Equipment.findByIdAndUpdate(
            id, 
            { assigned_to: '',
                filter_type:filter_type,
              filters_last_changed: lastChanged,
              filters_due: nextduedate
             }
          );
          if(!equipment){res.send("Unit with " + id + " was not found")}
          tasks = await Equipment.find({ assigned_to: 'dj' });
            res.json(tasks);
        } catch (error) {
          console.error(`Error updating equipment with ID ${id}:`, error);
        }

    break;

}
}

module.exports = {
  manageTasks
};
