const { where } = require("sequelize");
const Tought = require("../models/Tought");
const ToughtModel = require("../models/Tought");
const User = require("../models/User");
const { Op } = require("sequelize");
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");

const checkAuth = require("../models/User");

module.exports = class ToughtController {
  //
  static async showToughts(req, res) {
    const search = req.query.search || "";
    const order = req.query.order || "desc"; // Valor padrão para ordenação

    try {
      // Certificando-se de que o `search` é uma string válida
      const toughtsData = await Tought.find({
        title: { $regex: search, $options: "i" }, // Pesquisa com case-insensitive
      })
        .sort({ createdAt: order }) // Ordenação pela data de criação
        .populate("userId");

      if (!toughtsData || toughtsData.length === 0) {
        return res.status(404).json({
          message: "Nenhum pensamento encontrado",
          toughts: [],
          search,
          toughtsQty: 0,
        });
      }

      const toughtsQty = toughtsData.length;

      res.json({
        toughts: toughtsData,
        search,
        toughtsQty,
      });
    } catch (error) {
      console.error("Erro ao buscar pensamentos:", error);
      res.status(500).json({ error: "Erro ao buscar pensamentos" });
    }
  }

  static async dashboard(req, res) {
    try {
      const user = await User.findById(req.userId).populate("toughts");

      if (!user) {
        console.log(user);
        console.log(user);
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const toughts = user.toughts || [];
      const name = user.name;
      const email = user.email;
      const createdAt = new Date();

      const allToughts = await Tought.find().populate("userId");

      return res.json({
        toughts,
        allToughts,
        emptyToughts: toughts.length === 0,
        name,
        email,
        createdAt,
      });
    } catch (error) {
      console.error("Erro ao carregar pensamentos:", error);
      return res
        .status(500)
        .json({ message: "Erro ao carregar seus pensamentos." });
    }
  }

  static async profile(req, res) {
    try {
      const user = await User.findById(req.userId).populate("toughts");

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const toughts = user.toughts || [];
      console.log("Pensamentos do usuário:", user.toughts);

      const name = user.name;
      const email = user.email;
      const createdAt = new Date();
      console.log(toughts);
      return res.json({
        toughts,
        emptyToughts: toughts.length === 0,
        name,
        email,
        createdAt,
      });
    } catch (error) {
      console.error("Erro ao carregar pensamentos:", error);
      return res
        .status(500)
        .json({ message: "Erro ao carregar seus pensamentos." });
    }
  }

  static createTought(req, res) {
    return res.status(200).json({ message: "Você criou um novo post!" });
  }

  static async createToughtSave(req, res) {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "usuário não foi encontrado // if no toughtcontroler",
      });
    }

    const tought = {
      title: req.body.title,
      userId: req.userId,
    };

    try {
      const newTought = await Tought.create(tought);

      await User.findByIdAndUpdate(req.userId, {
        $push: { toughts: newTought._id },
      });

      console.log("o titulo precisa estar aqui: " + tought.title);

      return req.session.save(() => {
        res.status(201).json({
          message: "Pensamento compartilhado com sucesso!",
          tought: newTought,
        });
      });
    } catch (err) {
      console.log("Aconteceu um erro:", err);
      return res.status(500).json({
        message: "Erro ao criar pensamento.",
        error: err.message,
      });
    }
  }

  static async removeTought(req, res) {
    const user = await User.findById(req.userId).populate("toughts");

    const { id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido!" });
      }

      const tought = await ToughtModel.findById(id);

      if (!tought) {
        return res.status(404).json({ message: "Pensamento não encontrado!" });
      }

      if (tought.userId.toString() !== req.userId) {
        return res.status(403).json({
          message: "Você não tem permissão para deletar este pensamento.",
        });
      }

      await ToughtModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Pensamento deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar pensamento:", error);
      res.status(500).json({ message: "Erro interno ao deletar pensamento." });
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;
    try {
      const tought = await Tought.findById(id);
      if (!tought) {
        return res.status(404).json({
          message: "Pensamento não encontrado.",
        });
      }
      return res.status(200).json({
        tought,
      });
    } catch (error) {
      console.error("Erro ao buscar pensamento:", error);
      return res.status(500).json({
        message: "Erro ao buscar pensamento.",
        error: error.message,
      });
    }
  }
  static async updateToughtSave(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
    };

    try {
      const updatedTought = await Tought.findByIdAndUpdate(id, tought, {
        new: true,
      });

      if (!updatedTought) {
        return res.status(404).json({
          message: "Pensamento não encontrado!",
        });
      }

      req.flash("message", "Pensamento atualizado com sucesso!");

      req.session.save(() => {
        return res.status(200).json({
          message: "Pensamento atualizado com sucesso!",
          tought: updatedTought,
        });
      });
    } catch (err) {
      console.log("Erro: " + err);
      return res.status(500).json({
        message: "Erro ao atualizar o pensamento.",
        error: err.message,
      });
    }
  }
};
