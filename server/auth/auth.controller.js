const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const config = require("../../config/config");
const User = require("../user/user.model");
const bcrypt = require("bcryptjs");

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
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

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100,
  });
}

module.exports = { login, getRandomNumber, register };
