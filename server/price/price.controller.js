const Price = require("./price.model");
const Techpack = require("../techpack/techpack.model");

async function getPrice(req, res) {
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

async function updatePrice(req, res) {
  const techpack_id = req.body.techpack_id;
  const factory = req.body.factory;
  const materials = req.body.materials;
  const fee = req.body.fee;
  const delivery = req.body.delivery;
  const total = req.body.total;
  if (!techpack_id) {
    return res.status(400).json({
      success: false,
      message: "techpack id is required",
    });
  }
  if (!total) {
    return res.status(400).json({
      success: false,
      message: "total price is required",
    });
  }
  try {
    var techpack = await Techpack.findOne({ _id: techpack_id });
    var price;
    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack not found",
      });
    } else if (!techpack.price) {
      price = new Price();
    } else {
      price = await Price.findOne({ _id: techpack.price });
    }
    price.techpack_id = techpack_id;
    price.factory = factory;
    price.materials = materials;
    price.fee = fee;
    price.delivery = delivery;
    price.total = total;
    price = await price.save();
    techpack.price = price._id;
    await techpack.save();
    return res.status(200).json({
      success: true,
      message: "price saved successfully",
    });
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { getPrice, updatePrice };
