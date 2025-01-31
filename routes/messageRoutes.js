const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController');
const { checkAuth } = require('../helpers/auth');


// Rota para criar mensagem
router.post('/:userId',checkAuth, messageController.createMessage); 

// Rota para listar mensagens
//router.get('/:userId', messageController.getMessages);

// Buscar mensagem entre users
router.get(":userId/:contactId",checkAuth, messageController.searchChat);
// Rota para atualizar mensagem
//router.put('/:id', messageController.updateMessage);

// Rota para deletar mensagem
//router.delete('/:id', messageController.deleteMessage);

module.exports = router;
