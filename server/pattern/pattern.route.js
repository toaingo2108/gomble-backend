const express = require("express");
const patternCtrl = require("./pattern.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/add").post(patternCtrl.addPattern);
router.route("/").post(sketchCtrl.getPatterns);

module.exports = router;
