const User = require("./user.model");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");

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
async function updateProfile(req, res) {
  const _id = req.decoded._id;
  try {
    var user = await User.findOne({ _id });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    } else {
      let update = {};
      var updateStr = "";
      if (req.body.first_name && req.body.first_name != user.first_name) {
        updateStr = "Firstname";
        update.first_name = req.body.first_name;
      }
      if (req.body.last_name && req.body.last_name != user.last_name) {
        if (updateStr != "") updateStr += ", ";
        updateStr += "Lastname";
        update.last_name = req.body.last_name;
      }
      if (req.body.email && req.body.email != user.email) {
        if (updateStr != "") updateStr += ", ";
        updateStr += "Email";
        update.email = req.body.email;
      }
      if (req.body.nickname && req.body.nickname != user.nickname) {
        if (updateStr != "") updateStr += ", ";
        updateStr += "Nickname";
        update.nickname = req.body.nickname;
      }
      if (req.body.description && req.body.description != user.description) {
        if (updateStr != "") updateStr += ", ";
        updateStr += "Description";
        update.description = req.body.description;
      }
      if (req.body.website && req.body.website != user.website) {
        if (updateStr != "") updateStr += ", ";
        updateStr += "Website";
        update.website = req.body.website;
      }
      if (req.body.phone && req.body.phone != user.phone) {
        if (updateStr != "") updateStr += ", ";
        updateStr += "Phone";
        update.phone = req.body.phone;
      }

      var photo = "default.jpg";
      if (req.files != null) {
        const { errors, filename } = fileUserProfileUpload(
          user._id,
          req.files.image
        );
        if (!isEmpty(errors)) {
          return res.status(500).json({
            success: false,
            message: `image upload error. ${errors}`,
          });
        } else {
          photo = filename;
        }
        if (updateStr != "") updateStr += ", ";
        updateStr += "Image";
        update.image = photo;
      } else {
        console.log("empty profile image");
      }
      if (updateStr == "") {
        return res
          .status(400)
          .json({ success: false, message: "Nothing to update" });
      }
      await User.update({ _id }, { $set: update });
      user = await User.findOne({ _id });
      return res.status(200).json({
        success: true,
        res: user,
        message: `${updateStr} Updated successfully`,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

fileUserProfileUpload = (user_id, photo) => {
  const ext = path.extname(photo.name);
  const filename = user_id + ext;
  const errors = "";

  if (!fs.existsSync("public")) {
    fs.mkdirSync("public", 0777, function (err) {
      if (err) {
        console.log(err);
        errors = "No permission to make the directory";
      }
    });
  }
  if (!fs.existsSync("public/uploads")) {
    fs.mkdirSync("public/uploads", 0777, function (err) {
      if (err) {
        console.log(err);
        errors = "No permission to make the directory";
      }
    });
  }
  if (!fs.existsSync("public/uploads/users")) {
    fs.mkdirSync("public/uploads/users", 0777, function (err) {
      if (err) {
        console.log(err);
        errors = "No permission to make the directory";
      }
    });
  }

  console.log(photo);

  photo.mv("public/uploads/users/" + filename, function (err, success) {
    if (err) {
      console.log(err);
    }
    const updatedUser = {
      image: filename,
    };

    User.findOneAndUpdate({ _id: user_id }, updatedUser)
      .then((oldResult) => {})
      .catch((err) => {
        errors = `Something went wrong. ${err}`;
      });
  });

  return {
    errors,
    filename,
  };
};
module.exports = { setType, profile, updateProfile };
