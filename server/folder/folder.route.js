const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const folderCtrl = require("./folder.controller");

const router = express.Router(); // eslint-disable-line new-cap

router.route("/create").post(folderCtrl.createFolder);
router.route("/").post(folderCtrl.getFolders);

module.exports = router;
