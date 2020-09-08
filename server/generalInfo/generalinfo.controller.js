const Stage = require("./generalinfo.model");

async function getStage(req, res) {
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

async function createFolder(req, res) {
  const user_id = req.decoded._id;
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }
  try {
    var folder = await Folder.findOne({ name });
    if (folder) {
      return res.status(400).json({
        success: false,
        message: "Exising folder! Please pick another name",
      });
    } else {
      var newFolder = new Folder({
        name,
        user_id,
      });
      await newFolder.save();
      return res.status(200).json({
        success: true,
        message: "new folder creted successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { getTechpacks, createFolder };
