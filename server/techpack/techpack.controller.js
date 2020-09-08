const Techpack = require("./techpack.model");

async function getTechpacks(req, res) {
  const folder_id = req.body.folder_id;
  if (!folder_id) {
    return res.status(400).json({
      success: false,
      message: "Folder id is required",
    });
  }
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

async function getDraft(req, res) {
  const folder_id = req.body.folder_id;
  if (!folder_id) {
    return res.status(400).json({
      success: false,
      message: "Folder id is required",
    });
  }
  try {
    var techpack = await Techpack.findOne({ folder_id, is_draft: true });
    if (techpack) {
      return res.status(400).json({
        success: true,
        res: techpack._id,
      });
    }
    var newTechpack = new Techpack({
      folder_id,
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

module.exports = { getTechpacks, getDraft };
