const express = require("express");
const colorCtrl = require("./color.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/add").post(colorCtrl.addColor);
router.route("/").post(colorCtrl.getColors);

module.exports = router;
