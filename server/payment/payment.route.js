const express = require("express");
const paymentCtrl = require("./payment.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/checkouts").post(paymentCtrl.checkouts);
router.route("/client-token").post(paymentCtrl.generateClientToken);
router.route("/orders").post(paymentCtrl.getOrders);

module.exports = router;
