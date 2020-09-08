const Techpack = require("./techpack.model");

async function getTechpacks(req, res) {
  const folder_id = req.decoded.folder_id;

  try {
    var techpacks = await Techpack.find({ folder_id });
    return res.status(200).json({
      success: true,
      res: techpacks,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function createTechpack(req, res) {
  const folder_id = req.decoded.folder_id;

  if (!folder_id) {
    return res.status(400).json({
      success: false,
      message: "Folder id is required",
    });
  }
  try {
    var newFolder = new Folder({
      folder_id,
    });
    await newFolder.save();
    return res.status(200).json({
      success: true,
      message: "new techpack creted successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { getTechpacks, createTechpack };
