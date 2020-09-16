var braintree = require("braintree");
const User = require("../user/user.model");
const Order = require("./order.model");
const Techpack = require("../techpack/techpack.model");

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "9vjqpnthwgm9zp8q",
  publicKey: "vmhrn28zz44w9t3q",
  privateKey: "835758586cfe8a52fb17f14a19541690",
});

async function generateClientToken(req, res) {
  const _id = req.decoded._id;
  try {
    var user = await User.findOne({ _id });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    var customer_id = user.payment_customer_id;
    if (!customer_id) {
      var result = await gateway.customer.create({
        firstName: user.first_name,
        lastName: user.last_name,
        company: user.company,
        email: user.email,
        phone: user.phone,
        fax: user.fax,
        website: user.website,
      });
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Customer creation failed",
          res: result,
        });
      }
      user.payment_customer_id = result.customer.id;
      await user.save();
      customer_id = result.customer.id;
    }
    var response = await gateway.clientToken.generate({
      customerId: customer_id,
    });
    var clientToken = response.clientToken;
    return res.status(200).json({
      success: true,
      res: clientToken,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}
async function checkouts(req, res) {
  const _id = req.decoded._id;
  const { amount, payment_method_nonce, techpack_id } = req.body;
  try {
    var techpack = await Techpack.findOne({ _id: techpack_id });
    if (!techpack) {
      return res.status(400).json({
        success: false,
        message: "Techpack does not exist",
      });
    }
    var buyer = await User.findOne({ _id });
    var seller = await User.findOne({ _id: techpack.designer });
    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "Seller is invalid",
      });
    }
    var result = await gateway.transaction.sale({
      amount,
      payment_method_nonce,
      options: { submitForSettlement: true },
    });
    const { success, transaction } = result;
    var order = new Order({
      techpack_id,
      buyer: buyer._id,
      seller: seller._id,
      price: amount,
      transaction,
      paid_state: transaction.processorResponseText,
      deliver_state: "none",
    });
    await order.save();
    if (success) {
      return res.status(200).json({
        success: true,
        res: transaction,
      });
    } else {
      return res.status(400).json({
        success: false,
        res: transaction,
      });
    }
  } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({ success: false, message: `err: ${err}` });
  }
}

module.exports = { generateClientToken, checkouts };
