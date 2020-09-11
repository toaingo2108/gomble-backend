const express = require("express");
const techpackCtrl = require("./techpack.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/draft").post(techpackCtrl.getDraft);
router.route("/publish").post(techpackCtrl.publish);
router.route("/").post(techpackCtrl.getTechpacks);

module.exports = router;
