const Factory = require("./factory.model");
const Techpack = require("../techpack/techpack.model");

async function getFactory(req, res) {
  const techpack_id = req.body.techpack_id;

  try {
    var factory = await Factory.findOne({ techpack_id });
    return res.status(200).json({
      success: true,
      res: factory,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

async function updateFactory(req, res) {
  const techpack_id = req.body.techpack_id;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const information = req.body.information;
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
    var factory;
    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack not found",
      });
    } else if (!techpack.factory) {
      factory = new Factory();
    } else {
      factory = await Factory.findOne({ _id: techpack.factory });
    }
    factory.techpack_id = techpack_id;
    factory.name = name;
    factory.email = email;
    factory.phone = phone;
    factory.information = information;

    factory = await factory.save();
    techpack.factory = factory._id;
    await techpack.save();
    return res.status(200).json({
      success: true,
      message: "factory saved successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { getFactory, updateFactory };
