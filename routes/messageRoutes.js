const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController');
const { checkAuth } = require('../helpers/auth');


// Rota para criar mensagem
router.post('/create',checkAuth, messageController.createMessage);

// Rota para listar mensagens
//router.get('/', messageController.getMessages);

// Rota para atualizar mensagem
//router.put('/:id', messageController.updateMessage);

// Rota para deletar mensagem
//router.delete('/:id', messageController.deleteMessage);

module.exports = router;
