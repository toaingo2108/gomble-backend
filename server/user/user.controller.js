const User = require("./user.model");

async function setType(req, res) {
  const type = req.body.type;
  const _id = req.decoded._id;
  if (!type) {
    return res.status(400).json({
      success: false,
      message: "Type is required",
    });
  }

  try {
    var user = await User.findOne({ _id });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    } else {
      if (user.type == type) {
        return res.status(400).json({
          success: false,
          message: "Nothing changed",
        });
      }
      user.type = type;
      await user.save();
      return res.status(200).json({
        success: true,
        message: `Type changed to ${type}`,
        type: type,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function profile(req, res) {
  const _id = req.decoded._id;
  try {
    var user = await User.findOne({ _id });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        res: user,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { setType, profile };
