const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); 
const userController = require('../controllers/userController');
const equipmentController = require('../controllers/equipmentController');
const filtertypesController = require('../controllers/filtertypeController');
const filtersController = require('../controllers/filtersController');
const tasksController = require('../controllers/tasksController');
const storageController = require('../controllers/storageController');

router.get('/storage', storageController.manageStorage)

router.get('/tasks', tasksController.manageTasks)

router.get('/equipment', equipmentController.manageEquipment)

router.get('/filtertypes', filtertypesController.manageFilterTypes)

router.get('/filters', filtersController.manageFilters)

router.get('/users', userController.manageUsers);

router.post('/users', userController.manageUsers);
module.exports = router;