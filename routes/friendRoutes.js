const express = require("express");
const router = express.Router();
  
  const { getUsers } = require('../controllers/FriendController'); 
  const { getUserProfile } = require('../controllers/FriendController');
  





  router.get('/', getUsers);

  router.get('/:username', getUserProfile);

  







  module.exports = router;
  
  

  


  