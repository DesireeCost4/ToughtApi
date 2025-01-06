const flash = require("express-flash");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const { where } = require("sequelize");

module.exports = class Authcontroller {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    console.log("E-mail enviado:", email);

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        req.flash("message", "Usuário não encontrado!");
        return res.render("auth/login");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        req.flash("message", "Senha inválida");
        return res.render("auth/login");
      }

      req.session.userid = user._id;
      req.flash("message", "Autenticação realizada com sucesso!");

      return res.redirect("/");
    } catch (error) {
      console.error("Erro no login:", error);
      req.flash("message", "Erro ao tentar realizar o login");
      return res.render("auth/login");
    }
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      req.flash("message", "Senhas não conferem, tente novamente!");
      return res.render("auth/register");
    }

    // Verificar se o usuário já existe
    const checkIfUserExists = await User.findOne({ email: email });

    if (checkIfUserExists) {
      req.flash("message", "O e-mail já está em uso!");
      return res.render("auth/register");
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      req.session.userid = createdUser.id;
      req.flash("message", "Cadastro realizado com sucesso!");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      console.error("Erro ao criar o usuário:", err);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
