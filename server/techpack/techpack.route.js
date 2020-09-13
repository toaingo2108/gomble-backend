const express = require("express");
const techpackCtrl = require("./techpack.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/draft").post(techpackCtrl.getDraft);
router.route("/publish").post(techpackCtrl.publish);
router.route("/designer").post(techpackCtrl.getDesignerProfile);
router.route("/").post(techpackCtrl.getTechpacks);
router.route("/products").post(techpackCtrl.getProducts);

module.exports = router;
