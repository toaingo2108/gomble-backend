const express = require("express");
const authCtrl = require("./auth.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/login").post(authCtrl.login);
router.route("/register").post(authCtrl.register);
router.route("/fblogin").post(authCtrl.fblogin);
router.route("/applelogin").post(authCtrl.applelogin);

module.exports = router;
