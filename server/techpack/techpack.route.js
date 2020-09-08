const express = require("express");
const techpackCtrl = require("./techpack.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/create").post(techpackCtrl.createTechpack);
router.route("/").post(techpackCtrl.getTechpacks);

module.exports = router;
