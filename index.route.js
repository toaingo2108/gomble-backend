const express = require("express");
const auth = require("./config/middlewares");
const userRoutes = require("./server/user/user.route");
const authRoutes = require("./server/auth/auth.route");
const folderRoutes = require("./server/folder/folder.route");
const techpackRoutes = require("./server/techpack/techpack.route");

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

module.exports = router;
