const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const config = require("../../config/config");
const User = require("../user/user.model");
const bcrypt = require("bcryptjs");

async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "password is required",
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    } else {
      let isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const payload = {
          _id: user._id,
          email: user.email,
        };
        let token = jwt.sign(payload, config.jwtSecret, {
          expiresIn: 31556926, // 1 year in seconds
        });
        return res.status(200).json({
          success: true,
          token: "Bearer " + token,
          type: user.type,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Password incorrect",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function register(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "password is required",
    });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    } else {
      const newUser = new User({
        email,
        password,
      });
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
      await newUser.save();
      return res.status(200).json({
        success: true,
        message: "Registered successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function fblogin(req, res) {
  const email = req.body.email;
  const accessToken = req.body.accessToken;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  if (!accessToken) {
    return res.status(400).json({
      success: false,
      message: "accessToken is required",
    });
  }

  // if (req.body.name == undefined) {
  //   return res.status(201).json({ success: false, msg: "name is missing" });
  // }
  // if (req.body.id == undefined) {
  //   return res.status(201).json({ success: false, msg: "id is missing" });
  // }

  try {
    let user = await User.findOne({ email });
    if (user) {
      if (!user.is_facebook) {
        return res
          .status(201)
          .json({ success: false, email: "Email already exists" });
      }
      const payload = {
        _id: user.id,
        email: user.email,
        is_facebook: true,
      };
      let token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: 31556926, // 1 year in seconds
      });
      return res.status(200).json({
        success: true,
        token: "Bearer " + token,
        type: user.type,
      });
    } else {
      const newUser = new User({
        email,
        password: bcrypt.hashSync(req.body.accessToken, 10),
        is_facebook: true,
      });

      await newUser.save();
      const payload = {
        _id: newUser._id,
        email: email,
        is_facebook: true,
      };
      let token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: 31556926, // 1 year in seconds
      });
      return res.status(200).json({
        success: true,
        token: "Bearer " + token,
        type: "-",
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { login, register, fblogin };
