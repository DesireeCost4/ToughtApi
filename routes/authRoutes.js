const express = require("express");
const router = express.Router();
const Authcontroller = require("../controllers/AuthController");

router.get("/login", Authcontroller.login);
router.post("/login", Authcontroller.loginPost);

router.get("/register", Authcontroller.register);
router.post("/register", Authcontroller.registerPost);
router.get("/logout", Authcontroller.logout);

module.exports = router;
