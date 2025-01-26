const jwt = require('jsonwebtoken');
const User = require('../models/User')
const Message = require('../models/Message');




class MessageController {


  async createMessage(req, res) {
    try {

      console.log(JSON.stringify(req.body, null, 2));

      const userId = req.userId; 
      const { content, toUser } = req.body;

      console.log('Requisição recebida:', { userId, toUser, content });


      const userExists = await User.findById(userId);
      console.log('Resultado da busca no banco:', userExists);

      console.log(userExists)

      if (!userExists) {
        return res.status(404).json({ message: 'Destinatário não encontrado.' });
      }

      if (!content || !toUser ||!userId) {
        return res.status(400).json({ message: 'Conteúdo e usuário são obrigatórios.' });
      }

  
      // Verifica se o usuário existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      // Encontra o destinatário
      const toUserData = await User.findOne({ username: toUser });
      if (!toUserData) {
        return res.status(404).json({ message: 'Destinatário não encontrado.' });
      }
  
      // Cria a mensagem
      const message = new Message({
        content: content,
        fromUser: req.userId, // O userId está sendo retirado do token JWT
        toUser: toUser
      });
  
      await message.save();
      res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (err) {
      console.error('Erro ao criar mensagem:', err);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }


  async getMessages(req, res) {
    const { userId } = req.params;

    try {
      const messages = await Message.find({ toUser: userId }).populate('fromUser', 'name email');
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao carregar mensagens' });
    }
  }



}

module.exports = new MessageController();
