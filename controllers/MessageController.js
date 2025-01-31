const jwt = require('jsonwebtoken');
const User = require('../models/User')
const Message = require('../models/Message');




class MessageController {


  async createMessage(req, res) {
    try {
      const { toUser, content } = req.body;
  
      console.log('Usuário autenticado:', req.userId);
      console.log('Mensagem:', { toUser, content });
  
      if (!content || !toUser) {
        return res.status(400).json({ message: 'Conteúdo e destinatário são obrigatórios.' });
      }
  
      console.log('Buscando destinatário com username:', toUser);
      const destinatario = await User.findOne({ username: new RegExp(`^${toUser}$`, 'i') });
  
      if (!destinatario) {
        console.log('Resultado da busca:', destinatario);
        return res.status(404).json({ message: 'Destinatário não encontrado.' });
      }
  
      const message = new Message({
        content,
        fromUser: req.userId,
        toUser: destinatario.username
      });

      
  
      console.log('Mensagem criada:', message);
  
      await message.save();
      res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
  
    } catch (err) {
      console.error('Erro ao criar mensagem:', err);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
  







async getMessages(req, res) {
  try {
    const { userId } = req.params; // Obtém o userId da URL
    console.log('Buscando mensagens recebidas para o usuário:', userId);

    // Busca as mensagens onde o usuário é o destinatário (toUser)
    const messages = await Message.find({ toUser: userId })
      .populate('fromUser', 'name') // Popula o nome do usuário remetente
      .populate('toUser', 'name'); // Popula o nome do usuário destinatário

    if (messages.length === 0) {
      return res.status(404).json({ message: 'Nenhuma mensagem recebida.' });
    }

    res.status(200).json(messages); // Retorna as mensagens recebidas
  } catch (err) {
    console.error('Erro ao buscar mensagens recebidas:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}






async searchChat(req, res) {
  const { userId, contactId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { fromUser: userId, toUser: contactId },
        { fromUser: contactId, toUser: userId },
      ],
    })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
}
}




module.exports = new MessageController();
