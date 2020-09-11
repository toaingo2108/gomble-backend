const express = require("express");
const stageCtrl = require("./stage.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/update").post(stageCtrl.updateStage);
router.route("/").post(stageCtrl.getStage);

module.exports = router;
