const flash = require("express-flash");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const { where } = require("sequelize");

module.exports = class Authcontroller {
  static login(req, res) {
    res.json({ message: "Por favor realize login, aqui: " });
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    console.log("E-mail enviado:", email);

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado!" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Senha inválida" });
      }

      const token = jwt.sign({ id: user.id }, "seu_segredo", {
        expiresIn: "1h",
      });

      return res.status(200).json({
        message: "Autenticação realizada com sucesso!",
        token,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      req.flash("message", "Erro ao tentar realizar o login");
      return res
        .status(500)
        .json({ message: "Erro ao tentar realizar o login" });
    }
  }

  static register(req, res) {
    res
      .status(200)
      .json({ message: "Por favor, forneça seus dados para registro." });
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      req.flash("message", "Senhas não conferem, tente novamente!");
      return res.status(400).json({ error: "As senhas não coincidem!" });
    }

    // Verificar se o usuário já existe
    const checkIfUserExists = await User.findOne({ email: email });

    if (checkIfUserExists) {
      req.flash("message", "O e-mail já está em uso!");
      return res.status(400).json({ error: "O e-mail já está em uso!" });
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
      return res.status(500).json({ error: "Erro ao criar o usuário" });
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao realizar logout" });
      }
      return res.json({ message: "Logout realizado com sucesso!" });
    });
  }
};
