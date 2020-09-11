const express = require("express");
const sketchCtrl = require("./sketch.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/add").post(sketchCtrl.addSketch);
router.route("/").post(sketchCtrl.getSketches);

module.exports = router;
