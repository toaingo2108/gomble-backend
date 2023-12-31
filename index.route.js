const express = require("express");
const auth = require("./config/middlewares");
const userRoutes = require("./server/user/user.route");
const authRoutes = require("./server/auth/auth.route");
const folderRoutes = require("./server/folder/folder.route");
const techpackRoutes = require("./server/techpack/techpack.route");
const stageRoutes = require("./server/stage/stage.route");
const generalinfoRoutes = require("./server/generalinfo/generalinfo.route");
const sketchRoutes = require("./server/sketch/sketch.route");
const priceRoutes = require("./server/price/price.route");
const materialRoutes = require("./server/material/material.route");
const colorRoutes = require("./server/color/color.route");
const paymentRoutes = require("./server/payment/payment.route");
const patternRoutes = require("./server/pattern/pattern.route");
const measurementRoutes = require("./server/measurement/measurement.route");
const readyToWearRoutes = require("./server/readytowear/readytowear.route");
const factoryRoutes = require("./server/factory/factory.route");
const collaborationRoutes = require("./server/collaboration/collaboration.route");

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("OK"));

// mount auth routes at /auth
router.use("/auth", authRoutes);
router.use(auth); //middleware to check auth token

router.use("/users", userRoutes);
router.use("/folders", folderRoutes);
router.use("/techpacks", techpackRoutes);
router.use("/stage", stageRoutes);
router.use("/generalinfo", generalinfoRoutes);
router.use("/sketch", sketchRoutes);
router.use("/price", priceRoutes);
router.use("/material", materialRoutes);
router.use("/measurement", measurementRoutes);
router.use("/pattern", patternRoutes);
router.use("/color", colorRoutes);
router.use("/readytowear", readyToWearRoutes);
router.use("/payment", paymentRoutes);
router.use("/factory", factoryRoutes);
router.use("/collaboration", collaborationRoutes);

module.exports = router;
