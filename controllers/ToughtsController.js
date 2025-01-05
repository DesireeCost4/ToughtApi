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

    let order = "DESC";

    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]],
    });

    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    let toughtsQty = toughts.length;

    if (toughtsQty === 0) {
      toughtsQty = false;
    }

    res.render("layouts/toughts/home", { toughts, search, toughtsQty });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Tought,
      plain: true,
    });
    //verifica se user está logado
    if (!user) {
      res.redirect("login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render("layouts/toughts/dashboard", { toughts, emptyToughts });
  }

  static createTought(req, res) {
    res.render("layouts/toughts/create");
  }

  static async createToughtSave(req, res) {
    console.log("User ID na sessão:", req.session.userid); // Para verificar se o ID está presente

    const tought = {
      title: req.body.title,
      userId: req.session.userid,
    };

    try {
      await Tought.create(tought);
      req.flash("message", "Pensamento compartilhado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("aconteceu um erro:" + err);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;

    const userId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, userId: userId } });

      req.flash("message", "Pensamento removido com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("aconteceu um erro:" + err);
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ where: { id: id }, raw: true });

    res.render("layouts/toughts/edit", { tought });
  }

  static async updateToughtSave(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
    };
    try {
      await Tought.update(tought, { where: { id: id } });

      req.flash("message", "Pensamento atualizado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log("Erro" + err);
    }
  }
};
