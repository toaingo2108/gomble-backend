const express = require("express");
const priceCtrl = require("./price.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/update").post(priceCtrl.updatePrice);
router.route("/").post(priceCtrl.getPrice);

module.exports = router;
