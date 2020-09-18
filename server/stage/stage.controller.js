const Stage = require("./stage.model");
const Techpack = require("../techpack/techpack.model");

async function getStage(req, res) {
  const techpack_id = req.body.techpack_id;

  try {
    var stage = await Stage.findOne({ techpack_id });
    return res.status(200).json({
      success: true,
      res: stage,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function updateStage(req, res) {
  const techpack_id = req.body.techpack_id;
  const title = req.body.title;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const completion = req.body.completion;
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
    var stage;
    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack not found",
      });
    } else if (!techpack.stage) {
      stage = new Stage();
    } else {
      stage = await Stage.findOne({ _id: techpack.stage });
    }
    stage.techpack_id = techpack_id;
    stage.title = title;
    stage.start_date = start_date;
    stage.end_date = end_date;
    stage.completion = completion;
    stage = await stage.save();
    techpack.stage = stage._id;
    await techpack.save();
    return res.status(200).json({
      success: true,
      message: "stage saved successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { getStage, updateStage };
