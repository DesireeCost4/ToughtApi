const jwt = require('jsonwebtoken');
const User = require('../models/User')



class MessageController {


  async createMessage(req, res) {
    try {

      console.log(JSON.stringify(req.body, null, 2));


      const { content, toUser } = req.body;
      const userId = req.userId; 
  
      if (!content || !toUser) {
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
      res.status(201).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (err) {
      console.error('Erro ao criar mensagem:', err);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }


}

module.exports = new MessageController();
