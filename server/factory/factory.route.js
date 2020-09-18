const express = require("express");
const factoryCtrl = require("./factory.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/update").post(factoryCtrl.updateFactory);
router.route("/").post(factoryCtrl.getFactory);

module.exports = router;
