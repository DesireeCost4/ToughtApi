const express = require("express");
const router = express.Router();
const checkAuth = require("../models/User");


  
const { getUsers, getUserProfile, postConnect } = require('../controllers/FriendController');

  

  router.get('/',getUsers);

  router.get('/:username', getUserProfile);

 router.post('/add/:id' ,postConnect)

  






  module.exports = router;
  
  

  


  