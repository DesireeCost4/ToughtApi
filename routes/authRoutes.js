const express = require("express");
const router = express.Router();
const Authcontroller = require("../controllers/AuthController");

router.post("/login", Authcontroller.login);

router.post("/register", Authcontroller.registerPost);

router.get("/logout", Authcontroller.logout);

module.exports = router;
