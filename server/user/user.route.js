const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const userCtrl = require("./user.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/set-type").post(userCtrl.setType);
router.route("/profile").post(userCtrl.profile);

module.exports = router;
