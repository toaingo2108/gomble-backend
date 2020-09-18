const Techpack = require("./techpack.model");
const Folder = require("../folder/folder.model");
const mongoose = require("mongoose");

async function getTechpacks(req, res) {
  const folder_id = req.body.folder_id;
  if (!folder_id) {
    return res.status(400).json({
      success: false,
      message: "Folder id is required",
    });
  }
  try {
    query = [
      {
        $match: {
          $and: [
            { folder_id: mongoose.Types.ObjectId(folder_id) },
            { is_draft: false },
          ],
        },
      },
      {
        $lookup: {
          from: "generalinfos",
          localField: "generalinfo",
          foreignField: "_id",
          as: "generalinfo_details",
        },
      },
      {
        $lookup: {
          from: "prices",
          localField: "price",
          foreignField: "_id",
          as: "price_details",
        },
      },
      {
        $set: {
          generalinfo_details: { $arrayElemAt: ["$generalinfo_details", 0] },
          price_details: { $arrayElemAt: ["$price_details", 0] },
        },
      },
      {
        $project: {
          _id: "$_id",
          title: "$generalinfo_details.title",
          image: "$generalinfo_details.image",
          tags: "$generalinfo_details.tags",
          price_total: "$price_details.total",
        },
      },
    ];
    var techpacks = await Techpack.aggregate(query);
    // var techpacks = await Techpack.find({ folder_id, is_draft: false });
    return res.status(200).json({
      success: true,
      res: techpacks,
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}
async function getProducts(req, res) {
  const folder_id = req.body.folder_id;
  try {
    query = [
      {
        $match: { is_draft: false },
      },
      {
        $lookup: {
          from: "generalinfos",
          localField: "generalinfo",
          foreignField: "_id",
          as: "generalinfo_details",
        },
      },
      {
        $lookup: {
          from: "prices",
          localField: "price",
          foreignField: "_id",
          as: "price_details",
        },
      },
      {
        $set: {
          generalinfo_details: { $arrayElemAt: ["$generalinfo_details", 0] },
          price_details: { $arrayElemAt: ["$price_details", 0] },
        },
      },
      {
        $project: {
          _id: "$_id",
          title: "$generalinfo_details.title",
          image: "$generalinfo_details.image",
          tags: "$generalinfo_details.tags",
          price_total: "$price_details.total",
        },
      },
    ];
    var techpacks = await Techpack.aggregate(query);
    // var techpacks = await Techpack.find({ folder_id, is_draft: false });
    return res.status(200).json({
      success: true,
      res: techpacks,
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}
async function getDraft(req, res) {
  const folder_id = req.body.folder_id;
  const designer = req.decoded._id;
  if (!folder_id) {
    return res.status(400).json({
      success: false,
      message: "Folder id is required",
    });
  }
  try {
    var techpack = await Techpack.findOne({ folder_id, is_draft: true });
    if (techpack) {
      return res.status(200).json({
        success: true,
        res: techpack._id,
      });
    }
    var newTechpack = new Techpack({
      folder_id,
      designer,
    });
    newTechpack = await newTechpack.save();
    return res.status(200).json({
      success: true,
      res: newTechpack._id,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function publish(req, res) {
  const _id = req.body.techpack_id;
  if (!_id) {
    return res.status(400).json({
      success: false,
      message: "techpack id is required",
    });
  }
  try {
    var techpack = await Techpack.findOne({ _id });
    if (!techpack) {
      return res.status(400).json({
        success: true,
        message: "techpack not found",
      });
    }
    techpack.is_draft = false;
    await techpack.save();
    var folder = await Folder.findOne({ _id: techpack.folder_id });
    folder.items.push(techpack._id);
    await folder.save();

    return res.status(200).json({
      success: true,
      res: techpack._id,
      message: "techpack published successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function getDesignerProfile(req, res) {
  const techpack_id = req.body.techpack_id;
  if (!techpack_id) {
    return res.status(400).json({
      success: false,
      message: "Techpack id is required",
    });
  }
  try {
    query = [
      {
        $match: { _id: mongoose.Types.ObjectId(techpack_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "designer",
          foreignField: "_id",
          as: "designer_details",
        },
      },
      {
        $set: {
          designer_details: { $arrayElemAt: ["$designer_details", 0] },
        },
      },
      {
        $project: {
          _id: "$_id",
          first_name: "$designer_details.first_name",
          last_name: "$designer_details.last_name",
          image: "$designer_details.image",
        },
      },
    ];
    var techpacks = await Techpack.aggregate(query);
    // var techpacks = await Techpack.find({ folder_id, is_draft: false });
    return res.status(200).json({
      success: true,
      res: techpacks,
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function deleteTechpack(req, res) {
  const _id = req.body.techpack_id;
  if (!_id) {
    return res.status(400).json({
      success: false,
      message: "techpack id is required",
    });
  }
  try {
    var techpack = await Techpack.findOne({ _id });
    if (!techpack) {
      return res.status(400).json({
        success: true,
        message: "techpack not found",
      });
    }
    await techpack.delete();

    return res.status(200).json({
      success: true,
      message: "techpack deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = {
  getTechpacks,
  getDraft,
  publish,
  getDesignerProfile,
  getProducts,
  deleteTechpack,
};
