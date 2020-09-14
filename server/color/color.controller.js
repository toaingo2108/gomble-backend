const Color = require("./color.model");
const Material = require("../material/material.model");
const mongoose = require("mongoose");

async function getColors(req, res) {
  const _id = req.body.material_id;

  try {
    query = [
      {
        $match: { _id: mongoose.Types.ObjectId(_id) },
      },
      {
        $lookup: {
          from: "colors",
          localField: "colors",
          foreignField: "_id",
          as: "color_list",
        },
      },
      {
        $project: {
          color_list: "$color_list",
        },
      },
    ];
    var material = await Material.aggregate(query);
    return res.status(200).json({
      success: true,
      res: material,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function addColor(req, res) {
  const material_id = req.body.material_id;
  const code = req.body.code;
  const description = req.body.description;

  if (!material_id) {
    return res.status(400).json({
      success: false,
      message: "material_id is required",
    });
  }
  if (!code) {
    return res.status(400).json({
      success: false,
      message: "code is required",
    });
  }
  try {
    var material = await Material.findOne({ _id: material_id });
    if (!material) {
      return res.status(400).json({
        success: false,
        message: "Material not found",
      });
    }
    var color = new Color({
      code,
      description,
    });
    color = await color.save();
    if (!material.colors) {
      material.colors = [];
    }

    material.colors.push(color._id);
    await material.save();

    return res.status(200).json({
      success: true,
      message: "color added successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { addColor, getColors };
