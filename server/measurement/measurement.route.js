const express = require("express");
const measurementCtrl = require("./measurement.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/add").post(measurementCtrl.addMeasurement);
router.route("/").post(measurementCtrl.getMeasurements);
router.route("/update-basic-info").post(measurementCtrl.updateBasicInfo);

module.exports = router;
