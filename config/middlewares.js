const jwt = require("jsonwebtoken");
const config = require("./config");

module.exports = function auth(req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Failed to authenticate token." });
      } else {
        req.decoded = decoded;
        return next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "No token provided." });
  }
};
