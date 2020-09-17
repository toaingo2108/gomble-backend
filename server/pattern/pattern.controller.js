const Pattern = require("./pattern.model");
const Techpack = require("../techpack/techpack.model");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");

async function getPatterns(req, res) {
  const techpack_id = req.body.techpack_id;

  try {
    var patterns = await Pattern.find({ techpack_id });
    return res.status(200).json({
      success: true,
      res: patterns,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function addPattern(req, res) {
  const techpack_id = req.body.techpack_id;
  console.log(techpack_id);
  const title = req.body.title;
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
    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack not found",
      });
    } else if (!techpack.patterns) {
      techpack.patterns = [];
    }
    var pattern = new Pattern({
      techpack_id,
      title,
      description,
    });
    pattern = await pattern.save();

    var photo = "default.jpg";

    if (req.files != null) {
      const { errors, filename } = filePatternImageUpload(
        pattern._id,
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
      pattern.image = photo;
    } else {
      console.log("empty pattern image");
    }

    techpack.patterns.push(pattern._id);
    await techpack.save();

    return res.status(200).json({
      success: true,
      message: "pattern added successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}
filePatternImageUpload = (pattern_id, photo) => {
  const ext = path.extname(photo.name);
  const filename = pattern_id + ext;
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
  if (!fs.existsSync("public/uploads/patterns")) {
    fs.mkdirSync("public/uploads/patterns", 0777, function (err) {
      if (err) {
        console.log(err);
        errors = "No permission to make the directory";
      }
    });
  }

  console.log(photo);

  photo.mv("public/uploads/patterns/" + filename, function (err, success) {
    if (err) {
      console.log(err);
    }
    const updatedPattern = {
      image: filename,
    };

    Pattern.findOneAndUpdate({ _id: pattern_id }, updatedPattern)
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
module.exports = { getPatterns, addPattern };
