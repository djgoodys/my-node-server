const User = require('../models/userModel'); 
const Equipment = require('../models/equipmentModel'); 
const bcrypt = require('bcrypt');
const { request } = require('express');

async function manageUsers(req, res) {
const action = req.query.action || req.body.action;
const userId = req.query.id || req.body.id;
const unitId = req.query.unit_id || req.body.unit_id;
const username = req.query.username || req.body.username;
const email = req.query.email || req.body.email;
const password = req.query.password || req.body.password;
const admin = req.query.admin || req.body.admin;

switch(action){
  case "login":
  try{
      let response = '';
      const { username, password } = req.body;
      const user = await User.find({ username });
      if (user.length > 0) {
        res.json({user});
        user.forEach(user => {
          console.log("name: " + user.username + " password:" + user.password);
        })
      } else {
        console.log("No users found with that username");
      }
      
      //res.json({user});
     
    
    } catch (err) {
      console.error('Error during login:', err);
      return res.status(500).send(err);
    }
    break;


  case "get-user":
 
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
  break;

  case "get-all-users":
 
  try {
    const users = await User.find();
    if (users) {
    res.json(users);
    }
   else {
      return res.status(404).json({ message: 'No Users found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
  break;

  case "createUser":
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
  break;

  case "edit-user":
  try {
    const user = await User.findByIdAndUpdate(userId, {
      username: username,
      password: password,
      email:email,
      admin:admin
    });
    const users = await User.find();
    if (users) {
    res.json(users);
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
  } catch (err) {
    return res.status(500).send(err);
  }
  break;

   case "deleteUser":
  User.findByIdAndRemove(userId, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'User successfully deleted', user });
  });
  break;
}

}
module.exports = {
  manageUsers
};
