
const express = require('express')
const router = express.Router();
const User = require('../models/User')
const Friendship = require('../models/Friendship');

async function getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users); 
    } catch (error) {
      console.error(error); 
      res.status(500).send('Erro ao recuperar usuários.'); 
    }
  }

  async function getUserProfile(req, res) {
    try {
      const users = await User.find({
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { username: { $regex: req.query.search, $options: 'i' } }
        ]
      });
  
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  async function postConnect(req, res) {
    console.log('entrei na função');

    try {
      const friendId = req.params.id; 
      console.log('estou no friendcontroler',friendId);
  
      const userId = req.body.userId; 
      console.log(userId);
  
      if (!userId || !friendId) {
        return res.status(404).json({ message: 'Usuário ou amigo não encontrado.' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      if (!user.friends) {
        user.friends = []; 
      }
  
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: 'Este usuário já é seu amigo.' });
      }
  
      const friendship = new Friendship({
        user1: userId,
        user2: friendId,
        status: 'pendente',
      });
  
      await friendship.save();
  
      user.friends.push(friendId);
      await user.save();
  
      return res.status(200).json({ message: 'Solicitação de amizade enviada com sucesso!' });
  
    } catch (error) {
      console.error('Erro ao processar solicitação de amizade:', error);
      return res.status(500).json({ message: 'Erro ao processar a solicitação de amizade' });
    }
  }
  




    
  




  


  
  module.exports = { getUsers, getUserProfile, postConnect}; 