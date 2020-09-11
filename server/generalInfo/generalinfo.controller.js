const GeneralInfo = require("./generalinfo.model");
const Techpack = require("../techpack/techpack.model");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");

async function getGeneralInfo(req, res) {
  const _id = req.decoded._id;

  try {
    var folders = await Folder.find({ user_id: _id });
    return res.status(200).json({
      success: true,
      res: folders,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function updateGeneralInfo(req, res) {
  const techpack_id = req.body.techpack_id;
  const title = req.body.title;
  var tagArr = [];
  if (req.body.tags) tagArr = req.body.tags.split(",");
  const description = req.body.description;

  if (!techpack_id) {
    return res.status(400).json({
      success: false,
      message: "techpack id is required",
    });
  }
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "title is required",
    });
  }

  try {
    var techpack = await Techpack.findOne({ _id: techpack_id });
    var generalinfo;
    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack not found",
      });
    } else if (!techpack.generalinfo) {
      generalinfo = new GeneralInfo();
    } else {
      generalinfo = await GeneralInfo.findOne({ _id: techpack.generalinfo });
    }
    generalinfo.techpack_id = techpack_id;
    generalinfo.title = title;
    generalinfo.tags = tagArr;
    generalinfo.description = description;
    generalinfo = await generalinfo.save();

    var photo = "default.jpg";

    if (req.files != null) {
      const { errors, filename } = fileGeneralInfoUpload(
        generalinfo._id,
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
      generalinfo.image = photo;
    } else {
      console.log("empty general info image");
    }

    techpack.generalinfo = generalinfo._id;
    await techpack.save();

    return res.status(200).json({
      success: true,
      message: "general info saved successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}
getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

fileGeneralInfoUpload = (generalinfo_id, photo) => {
  const ext = path.extname(photo.name);
  const filename = `${generalinfo_id}_${getRandomInt(100)}${ext}`;
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
  if (!fs.existsSync("public/uploads/generalinfo")) {
    fs.mkdirSync("public/uploads/generalinfo", 0777, function (err) {
      if (err) {
        console.log(err);
        errors = "No permission to make the directory";
      }
    });
  }

  console.log(photo);

  photo.mv("public/uploads/generalinfo/" + filename, function (err, success) {
    if (err) {
      console.log(err);
    }
    const updatedGeneralInfo = {
      image: filename,
    };

    GeneralInfo.findOneAndUpdate({ _id: generalinfo_id }, updatedGeneralInfo)
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

module.exports = { getGeneralInfo, updateGeneralInfo };
