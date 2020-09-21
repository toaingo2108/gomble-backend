const Collaboration = require("./collaboration.model");
const Techpack = require("../techpack/techpack.model");

async function getCollaboration(req, res) {
  const techpack_id = req.body.techpack_id;

  try {
    var collaboration = await Collaboration.findOne({ techpack_id });
    return res.status(200).json({
      success: true,
      res: collaboration,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function updateCollaboration(req, res) {
  const techpack_id = req.body.techpack_id;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  if (!techpack_id) {
    return res.status(400).json({
      success: false,
      message: "techpack id is required",
    });
  }
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "email is required",
    });
  }
  try {
    var techpack = await Techpack.findOne({ _id: techpack_id });

    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack not found",
      });
    } else if (!techpack.collaboration) {
      techpack.collaboration = [];
      collaboration = new Collaboration();
    }
    var collaboration = new Collaboration(techpack_id, name, email, phone);

    collaboration = await collaboration.save();
    techpack.collaboration.push(collaboration._id);
    await techpack.save();
    return res.status(200).json({
      success: true,
      message: "collaboration saved successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { getCollaboration, updateCollaboration };
