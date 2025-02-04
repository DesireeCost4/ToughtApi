
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


 async function acceptFriendRequest(req, res) {
  try {
    const { requestId } = req.body; 
    const userId = req.userId; 

    if (!requestId) {
      return res.status(400).json({ message: "ID da solicitação não informado." });
    }

    const friendship = await Friendship.findOne({ _id: requestId, status: "pendente" });

    if (!friendship) {
      return res.status(404).json({ message: "Solicitação não encontrada ou já aceita." });
    }

    if (!friendship.user2.equals(userId)) {
      return res.status(403).json({ message: "Você não tem permissão para aceitar esta solicitação." });
    }

    friendship.status = "aceito";
    await friendship.save();

    await User.findByIdAndUpdate(friendship.user1, {
      $pull: { friendRequests: userId },
    });

    await User.findByIdAndUpdate(friendship.user2, {
      $pull: { friendRequests: friendship.user1 },
    });

    return res.json({ message: "Solicitação de amizade aceita!" });
  } catch (error) {
    console.error("Erro ao aceitar solicitação de amizade:", error);
    return res.status(500).json({ message: "Erro ao processar a solicitação." });
  }
}

 async function rejectFriendRequest(req, res) {
  try {
    const { requestId } = req.body;
    const userId = req.userId;

    if (!requestId) {
      return res.status(400).json({ message: "ID da solicitação não informado." });
    }

    const friendship = await Friendship.findOne({ _id: requestId, status: "pendente" });

    if (!friendship) {
      return res.status(404).json({ message: "Solicitação não encontrada ou já resolvida." });
    }

    if (!friendship.user2.equals(userId)) {
      return res.status(403).json({ message: "Você não tem permissão para recusar esta solicitação." });
    }

    await Friendship.findByIdAndDelete(requestId);

    return res.json({ message: "Solicitação de amizade recusada." });
  } catch (error) {
    console.error("Erro ao recusar solicitação de amizade:", error);
    return res.status(500).json({ message: "Erro ao processar a solicitação." });
  }
}

 async function getPendingRequests(req, res) {
  try {
    const pendingRequests = await Friendship.find({
      user2: req.userId,
      status: "pendente",
    }).populate("user1", "name email");

    return res.json({ pendingRequests });
  } catch (error) {
    console.error("Erro ao buscar solicitações pendentes:", error);
    return res.status(500).json({ message: "Erro ao buscar solicitações." });
  }
}

 async function getFriends(req, res) {
  try {
    const friends = await Friendship.find({
      $or: [{ user1: req.userId }, { user2: req.userId }],
      status: "aceito",
    }).populate("user1 user2", "name email");

    // Formatando a resposta para retornar apenas os amigos
    const friendList = friends.map((friendship) => {
      return friendship.user1._id.equals(req.userId) ? friendship.user2 : friendship.user1;
    });

    return res.json({ friends: friendList });
  } catch (error) {
    console.error("Erro ao buscar amigos:", error);
    return res.status(500).json({ message: "Erro ao buscar amigos." });
  }
}

  


  
  module.exports = { getUsers, getUserProfile, postConnect, acceptFriendRequest, rejectFriendRequest, getPendingRequests, getFriends }; 