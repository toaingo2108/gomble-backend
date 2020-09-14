const Material = require("./material.model");
const Techpack = require("../techpack/techpack.model");
const path = require("path");
const fs = require("fs");
const isEmpty = require("is-empty");
const mongoose = require("mongoose");

async function getMaterials(req, res) {
  const techpack_id = req.body.techpack_id;

  try {
    query = [
      {
        $match: {
          $and: [
            { techpack_id: mongoose.Types.ObjectId(techpack_id) },
            { is_draft: false },
          ],
        },
      },
      {
        $lookup: {
          from: "colors",
          localField: "colors",
          foreignField: "_id",
          as: "colors",
        },
      },
    ];
    var materials = await Material.aggregate(query);
    return res.status(200).json({
      success: true,
      res: materials,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function getDraft(req, res) {
  const techpack_id = req.body.techpack_id;
  if (!techpack_id) {
    return res.status(400).json({
      success: false,
      message: "techpack id is required",
    });
  }
  try {
    var material = await Material.findOne({ techpack_id, is_draft: true });
    if (material) {
      return res.status(200).json({
        success: true,
        res: material._id,
      });
    }
    var newMaterial = new Material({
      techpack_id,
      is_draft: true,
    });
    newMaterial = await newMaterial.save();
    return res.status(200).json({
      success: true,
      res: newMaterial._id,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function addMaterial(req, res) {
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
    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack not found",
      });
    } else if (!techpack.materials) {
      techpack.materials = [];
    }
    var material = await Material.findOne({ techpack_id, is_draft: true });
    material.title = title;
    material.description = description;
    material.tags = tagArr;
    material.placement = req.body.placement;
    material.quantity = req.body.quantity;
    material.price_per_item = req.body.price_per_item;
    material.price_total = req.body.price_total;
    material.factory_name = req.body.factory_name;
    material.factory_email = req.body.factory_email;
    material.factory_phone = req.body.factory_phone;
    material.factory_information = req.body.factory_information;
    material.is_draft = false;

    material = await material.save();

    var photo = "default.jpg";

    if (req.files != null) {
      const { errors, filename } = fileMaterialImageUpload(
        material._id,
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
      material.image = photo;
    } else {
      console.log("empty material image");
    }

    techpack.materials.push(material._id);
    await techpack.save();

    return res.status(200).json({
      success: true,
      message: "material added successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}
fileMaterialImageUpload = (material_id, photo) => {
  const ext = path.extname(photo.name);
  const filename = material_id + ext;
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
  if (!fs.existsSync("public/uploads/materials")) {
    fs.mkdirSync("public/uploads/materials", 0777, function (err) {
      if (err) {
        console.log(err);
        errors = "No permission to make the directory";
      }
    });
  }

  console.log(photo);

  photo.mv("public/uploads/materials/" + filename, function (err, success) {
    if (err) {
      console.log(err);
    }
    const updatedMaterial = {
      image: filename,
    };

    Material.findOneAndUpdate({ _id: material_id }, updatedMaterial)
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
module.exports = { addMaterial, getMaterials, getDraft };
