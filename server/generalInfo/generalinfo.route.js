const express = require("express");
const generalinfoCtrl = require("./generalinfo.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/update").post(generalinfoCtrl.updateGeneralInfo);
router.route("/").post(generalinfoCtrl.getGeneralInfo);

module.exports = router;
