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
        return res.render("layouts/toughts/home", {
          toughts: [],
          search,
          toughtsQty: false,
        });
      }

      const toughtsQty = toughtsData.length;

      res.render("layouts/toughts/home", {
        toughts: toughtsData,
        search,
        toughtsQty,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar pensamentos");
    }
  }

  static async dashboard(req, res) {
    try {
      const user = await User.findById(req.session.userid).populate("toughts");

      if (!user) {
        req.flash("message", "Usuário não encontrado!");
        return res.redirect("/");
      }

      const toughts = user.toughts || [];

      res.render("layouts/toughts/dashboard", {
        toughts,
        emptyToughts: toughts.length === 0,
      });
    } catch (error) {
      console.error("Erro ao carregar pensamentos:", error);
      req.flash("message", "Erro ao carregar seus pensamentos.");
      res.redirect("/");
    }
  }

  static createTought(req, res) {
    res.render("layouts/toughts/create");
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

      req.flash("message", "Pensamento compartilhado com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("Aconteceu um erro:", err);
      req.flash("message", "Erro ao criar pensamento.");
      res.redirect("/toughts/dashboard");
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const userId = req.session.userid;

    try {
      const result = await Tought.deleteOne({ _id: id, userId: userId });

      if (result.deletedCount === 0) {
        req.flash(
          "message",
          "Nenhum pensamento encontrado ou você não tem permissão para removê-lo."
        );
      } else {
        req.flash("message", "Pensamento removido com sucesso!");
      }

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("aconteceu um erro:" + err);
      req.flash("message", "Erro ao remover o pensamento.");
      res.redirect("/toughts/dashboard");
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findById(id);

    res.render("layouts/toughts/edit", { tought });
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
        req.flash("message", "Pensamento não encontrado!");
        return res.redirect("/toughts/dashboard");
      }

      req.flash("message", "Pensamento atualizado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("Erro: " + err);
      req.flash("message", "Erro ao atualizar o pensamento.");
      res.redirect("/toughts/dashboard");
    }
  }
};
