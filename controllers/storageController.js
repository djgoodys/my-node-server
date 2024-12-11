const Storage = require('../models/storageModel');
async function manageStorage(req, res) {
    const action = req.query.action;
    const id = req.query._id;

    let storage = [];

    switch (action){
        case "get-all-storage":
            try 
                {
                   
                    storage = await Storage.find({});
                    if(!storage){console.log("no storage")}
                    res.json(storage);
                 
                } catch (err) {
                    res.status(500).send(err);
                }
            break;

    }
}

module.exports = {
  manageStorage
};
