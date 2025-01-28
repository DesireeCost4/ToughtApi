const jwt = require('jsonwebtoken');
const User = require('../models/User')
const Message = require('../models/Message');




class MessageController {


  async createMessage(req, res) {
   
    try {

    const { userId } = req.params;
    const { toUser, content } = req.body;
  
    // Exemplo de busca no banco ou lógica adicional
    console.log('Usuário autenticado:', req.userId);
    console.log('Mensagem:', { userId, toUser, content });
  

    if (!content || !toUser) {
      return res.status(400).json({ message: 'Conteúdo e destinatário são obrigatórios.' });
    }


    console.log('Buscando destinatário com username:', toUser);
    const toUserData = await User.findOne({ name: toUser }); 
    console.log('Resultado da busca:', toUserData);
    if (!toUserData) {
      return res.status(404).json({ message: 'Destinatário não encontrado.' });
    }

    const message = new Message({
      content: content,
      fromUser: userId,  
      toUser: toUserData._id  
    });

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



}

module.exports = new MessageController();
