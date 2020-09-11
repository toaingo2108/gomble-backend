const Sketch = require("./sketch.model");
const Techpack = require("../techpack/techpack.model");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");

async function getSketches(req, res) {
  const techpack_id = req.body.techpack_id;

  try {
    var sketches = await Sketch.find({ techpack_id });
    return res.status(200).json({
      success: true,
      res: sketches,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function addSketch(req, res) {
  const techpack_id = req.body.techpack_id;
  console.log(techpack_id);
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
    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack not found",
      });
    } else if (!techpack.sketches) {
      techpack.sketches = [];
    }
    var sketch = new Sketch({
      techpack_id,
      title,
      tags: tagArr,
      description,
    });
    sketch = await sketch.save();

    var photo = "default.jpg";

    if (req.files != null) {
      const { errors, filename } = fileSketchImageUpload(
        sketch._id,
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
      sketch.image = photo;
    } else {
      console.log("empty sketch image");
    }

    techpack.sketches.push(sketch._id);
    await techpack.save();

    return res.status(200).json({
      success: true,
      message: "sketch added successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}
fileSketchImageUpload = (sketch_id, photo) => {
  const ext = path.extname(photo.name);
  const filename = sketch_id + ext;
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
  if (!fs.existsSync("public/uploads/sketches")) {
    fs.mkdirSync("public/uploads/sketches", 0777, function (err) {
      if (err) {
        console.log(err);
        errors = "No permission to make the directory";
      }
    });
  }

  console.log(photo);

  photo.mv("public/uploads/sketches/" + filename, function (err, success) {
    if (err) {
      console.log(err);
    }
    const updatedSketch = {
      image: filename,
    };

    Sketch.findOneAndUpdate({ _id: sketch_id }, updatedSketch)
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
module.exports = { getSketches, addSketch };
