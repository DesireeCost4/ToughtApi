const express = require("express");
const router = express.Router();
const checkAuth = require("../models/User");
const User = require('../models/User')
const FriendController = require("../controllers/FriendController");

  
const { getUsers, getUserProfile, postConnect, acceptFriendRequest, rejectFriendRequest,getPendingRequests,getFriends } = require('../controllers/FriendController');

  
  //listagem de todos os users ok
  router.get('/',getUsers);

  //acessar perfil do usuário ok 
  router.get('/:username', getUserProfile);

  //add amigo ok 
 router.post('/add/:id' ,postConnect)

// aceitar solcitação, ok
router.post("/accept-friend-request",  FriendController.acceptFriendRequest);

router.post("/reject-friend-request",  FriendController.rejectFriendRequest);
//listagem de solicitações !! ok 
router.get("/pending-requests/:userId", FriendController.getPendingRequests);

//listagens de amigos
router.get("/friends/:userId", FriendController.getFriends);
  






  module.exports = router;
  
  

  


  