const { where } = require("sequelize");
const Tought = require("../models/Tought");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = -1; // Valor padrão para DESC
    if (req.query.order === "old") {
      order = 1; // Se 'old' for passado, a ordenação será ASC
    }

    try {
      const toughtsData = await Tought.find({
        title: { $regex: search, $options: "i" },
      })
        .sort({ createdAt: order }) // Passa diretamente o valor de 'order'
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
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar pensamentos" });
    }
  }

  static async dashboard(req, res) {
    try {
      const user = await User.findById(req.session.userid).populate("toughts");

      if (!user) {
        req.flash("message", "Usuário não encontrado!");
        return res.status(404).json({ message: "Usuário não encontrado!" });
      }

      const toughts = user.toughts || [];

      res.json({
        toughts,
        emptyToughts: toughts.length === 0,
      });
    } catch (error) {
      console.error("Erro ao carregar pensamentos:", error);
      res.status(500).json({ error: "Erro ao carregar seus pensamentos." });
    }
  }

  static createTought(req, res) {
    res
      .status(200)
      .json({ message: "Aqui você pode criar um novo pensamento." });
  }

  static async createToughtSave(req, res) {
    console.log("User ID na sessão:", req.session.userid);

    const tought = {
      title: req.body.title,
      userId: req.session.userid,
    };

    try {
      const newTought = await Tought.create(tought);

      await User.findByIdAndUpdate(req.session.userid, {
        $push: { toughts: newTought._id },
      });

      req.session.save(() => {
        res.status(201).json({
          message: "Pensamento compartilhado com sucesso!",
          tought: newTought,
        });
      });
    } catch (err) {
      console.log("Aconteceu um erro:", err);
      res.status(500).json({
        message: "Erro ao criar pensamento.",
        error: err.message,
      });
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const userId = req.session.userid;

    try {
      const result = await Tought.deleteOne({ _id: id, userId: userId });

      if (result.deletedCount === 0) {
        return res.status(400).json({
          message:
            "Nenhum pensamento encontrado ou você não tem permissão para removê-lo.",
        });
      } else {
        return res.status(200).json({
          message: "Pensamento removido com sucesso!",
        });
      }
    } catch (err) {
      console.log("Aconteceu um erro:", err);
      return res.status(500).json({
        message: "Erro ao remover o pensamento.",
      });
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    try {
      // Tentando buscar o pensamento pelo ID
      const tought = await Tought.findById(id);

      if (!tought) {
        return res.status(404).json({
          message: "Pensamento não encontrado.",
        });
      }

      // Caso o pensamento seja encontrado, envia os dados do pensamento para o frontend
      return res.status(200).json({
        tought,
      });
    } catch (error) {
      // Caso ocorra algum erro
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
      // Caso ocorra algum erro, retorna erro 500
      console.log("Erro: " + err);
      return res.status(500).json({
        message: "Erro ao atualizar o pensamento.",
        error: err.message,
      });
    }
  }
};
