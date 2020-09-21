const express = require("express");
const collaborationCtrl = require("./collaboration.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/update").post(collaborationCtrl.updateCollaboration);
router.route("/").post(collaborationCtrl.getCollaboration);

module.exports = router;
