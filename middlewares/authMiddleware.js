module.exports = function (req, res, next) {
  if (!req.session.userid) {
    return res.redirect("/login"); // Redireciona para o login caso o usuário não esteja autenticado
  }
  next(); // Se estiver autenticado, permite a execução da próxima função (logout)
};
