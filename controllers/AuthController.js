const flash = require("express-flash");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const { where } = require("sequelize");

module.exports = class Authcontroller {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      console.log("estou no try");

      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userid = user._id.toString();

        const sessionUser = req.session.userid;
        console.log("UserId armazenado:", sessionUser);

        console.log("SESSION DENTRO DO TRY: " + sessionUser);
        console.log("esse é o req.session.userid: " + user._id);

        const token = jwt.sign({ userId: user._id }, "seuSegredoAqui", {
          expiresIn: "1h",
        });

        console.log("token no try: " + token);

        req.session.save((err) => {
          if (err) {
            console.error("Erro ao salvar a sessão:", err);
            return res.status(500).json({ message: "Erro ao salvar a sessão" });
          }

          console.log("Sessão salva com sucesso, ID:", req.session.userid);
          console.log("na sessão salva: " + user.email);
          return res.status(200).json({
            message: "Login realizado com sucesso!",
            token,
          });
        });
      } else {
        return res.status(400).json({ message: "Credenciais inválidas!" });
      }
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      res.status(500).send("Erro ao autenticar usuário: " + err);
    }
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    if (typeof password !== "string") {
      return res.status(400).json({ error: "A senha deve ser uma string!" });
    }

    if (!password) {
      return res.status(400).json({ error: "A senha é obrigatória!" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ error: "As senhas não coincidem!" });
    }

    const checkIfUserExists = await User.findOne({ email: email });

    if (checkIfUserExists) {
      return res.status(400).json({ error: "O e-mail já está em uso!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      req.session.userid = createdUser.id;

      console.log("Cadastro realizado com sucesso!");

      res.status(201).json({
        message: "Cadastro realizado com sucesso!",
        user: {
          name: createdUser.name,
          email: createdUser.email,
          id: createdUser.id,
        },
      });
    } catch (err) {
      console.error("Erro ao criar o usuário:", err);
      return res.status(500).json({ error: "Erro ao criar o usuário" });
    }
  }

  static logout(req, res) {
    try {
      console.log("Iniciando logout");
      console.log("Sessão antes do logout:", req.session);

      req.session.userid = null;

      req.session.destroy((err) => {
        if (err) {
          console.error("Erro ao destruir a sessão:", err);
          return res.status(500).json({ message: "Erro ao destruir a sessão" });
        }
        console.log("SESSÃO APÓS LOGOUT: " + req.session);

        return res
          .status(200)
          .json({ message: "Logout realizado com sucesso!" });
      });
    } catch (err) {
      console.error("Erro no logout:", err);
      res.status(500).send("Erro no logout: " + err);
    }
  }
};
