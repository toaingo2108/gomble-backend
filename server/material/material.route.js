const express = require("express");
const materialCtrl = require("./material.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/draft").post(materialCtrl.getDraft);
router.route("/add").post(materialCtrl.addMaterial);
router.route("/").post(materialCtrl.getMaterials);

module.exports = router;
