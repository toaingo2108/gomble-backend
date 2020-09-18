const ReadyToWear = require("./readytowear.model");
const Techpack = require("../techpack/techpack.model");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");

async function getReadyToWears(req, res) {
  const techpack_id = req.body.techpack_id;

  try {
    var readytowears = await ReadyToWear.find({ techpack_id });
    return res.status(200).json({
      success: true,
      res: readytowears,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function addReadyToWear(req, res) {
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
    } else if (!techpack.readytowears) {
      techpack.readytowears = [];
    }
    var readytowear = new ReadyToWear({
      techpack_id,
      title,
      description,
    });
    readytowear = await readytowear.save();

    var photo = "default.jpg";

    if (req.files != null) {
      const { errors, filename } = fileReadyToWearImageUpload(
        readytowear._id,
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
      readytowear.image = photo;
    } else {
      console.log("empty readytowear image");
    }

    techpack.readytowears.push(readytowear._id);
    await techpack.save();

    return res.status(200).json({
      success: true,
      message: "readytowear added successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}
fileReadyToWearImageUpload = (readytowear_id, photo) => {
  const ext = path.extname(photo.name);
  const filename = readytowear_id + ext;
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
  if (!fs.existsSync("public/uploads/readytowears")) {
    fs.mkdirSync("public/uploads/readytowears", 0777, function (err) {
      if (err) {
        console.log(err);
        errors = "No permission to make the directory";
      }
    });
  }

  console.log(photo);

  photo.mv("public/uploads/readytowears/" + filename, function (err, success) {
    if (err) {
      console.log(err);
    }
    const updatedReadyToWear = {
      image: filename,
    };

    ReadyToWear.findOneAndUpdate({ _id: readytowear_id }, updatedReadyToWear)
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
module.exports = { getReadyToWears, addReadyToWear };
