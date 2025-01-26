exports.getMessagesByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const messages = await Message.find({ user: userId }).populate('user');
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao obter mensagens', error });
    }
  };
  