const Measurement = require("./measurement.model");
const Techpack = require("../techpack/techpack.model");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");

async function getMeasurements(req, res) {
  const techpack_id = req.body.techpack_id;

  try {
    var measurements = await Measurement.find({ techpack_id });
    return res.status(200).json({
      success: true,
      res: measurements,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function addMeasurement(req, res) {
  const techpack_id = req.body.techpack_id;
  console.log(techpack_id);
  const title = req.body.title;
  const description = req.body.description;
  const tol = req.body.tol;
  var sizeRangeArr = [];
  if (req.body.size_ranges) sizeRangeArr = req.body.size_ranges.split(",");

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
    } else if (!techpack.measurements) {
      techpack.measurements = [];
    }

    var measurement = new Measurement({
      techpack_id,
      title,
      description,
      size_range: sizeRangeArr,
      tol,
    });
    measurement = await measurement.save();

    var photo = "default.jpg";

    if (req.files != null) {
      const { errors, filename } = fileMeasurementImageUpload(
        measurement._id,
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
      measurement.image = photo;
    } else {
      console.log("empty measurement image");
    }

    techpack.measurements.push(measurement._id);
    await techpack.save();

    return res.status(200).json({
      success: true,
      message: "measurement added successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}
async function updateBasicInfo(req, res) {
  const techpack_id = req.body.techpack_id;
  var sizeRangeArr = [];
  if (req.body.size_ranges) sizeRangeArr = req.body.size_ranges.split(",");
  const unit = req.body.unit;
  if (!techpack_id) {
    return res.status(400).json({
      success: false,
      message: "techpack id is required",
    });
  }
  if (!unit) {
    return res.status(400).json({
      success: false,
      message: "unit is required",
    });
  }
  try {
    var techpack = await Techpack.findOne({ _id: techpack_id });

    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack not found",
      });
    }
    techpack.measurement_unit = unit;
    techpack.measurement_size_range = sizeRangeArr;

    await techpack.save();
    return res.status(200).json({
      success: true,
      message: "measurement info saved successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

fileMeasurementImageUpload = (measurement_id, photo) => {
  const ext = path.extname(photo.name);
  const filename = measurement_id + ext;
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
  if (!fs.existsSync("public/uploads/measurements")) {
    fs.mkdirSync("public/uploads/measurements", 0777, function (err) {
      if (err) {
        console.log(err);
        errors = "No permission to make the directory";
      }
    });
  }

  console.log(photo);

  photo.mv("public/uploads/measurements/" + filename, function (err, success) {
    if (err) {
      console.log(err);
    }
    const updatedMeasurement = {
      image: filename,
    };

    Measurement.findOneAndUpdate({ _id: measurement_id }, updatedMeasurement)
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
module.exports = { getMeasurements, addMeasurement };
