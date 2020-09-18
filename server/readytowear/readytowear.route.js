const express = require("express");
const readytowearCtrl = require("./readytowear.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/add").post(readytowearCtrl.addReadyToWear);
router.route("/").post(readytowearCtrl.getReadyToWears);

module.exports = router;
