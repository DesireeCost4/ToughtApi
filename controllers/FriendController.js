
const express = require('express')
const router = express.Router();
const User = require('../models/User')

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



  
  module.exports = { getUsers, getUserProfile }; 