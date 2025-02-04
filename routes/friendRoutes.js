const express = require("express");
const router = express.Router();
const checkAuth = require("../models/User");
const User = require('../models/User')
const FriendController = require("../controllers/FriendController");

  
const { getUsers, getUserProfile, postConnect, acceptFriendRequest, rejectFriendRequest,getPendingRequests,getFriends } = require('../controllers/FriendController');

  
  //listagem de todos os users
  router.get('/',getUsers);

  //acessar perfil do usuário
  router.get('/:username', getUserProfile);

  //add amigo
 router.post('/add/:id' ,postConnect)


router.post("/accept-friend-request", checkAuth, FriendController.acceptFriendRequest);
router.post("/reject-friend-request", checkAuth, FriendController.rejectFriendRequest);
//listagem de solicitações 
router.get("/pending-requests",checkAuth, FriendController.getPendingRequests);

//listagens de amigos
router.get("/friends", checkAuth, FriendController.getFriends);

  






  module.exports = router;
  
  

  


  