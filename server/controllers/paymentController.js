const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const createRazorpayOrder = async (
  req,
  res
) => {
  try {

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt:
        "receipt_" +
        Date.now(),
    };

    const order =
      await razorpay.orders.create(
        options
      );

    res.status(200).json(
      order
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

const getKey = async (req, res) => {

  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
  });

};

const verifyPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_SECRET
        )
        .update(body.toString())
        .digest("hex");

    const isAuthentic =
      expectedSignature ===
      razorpay_signature;

    if (!isAuthentic) {

      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }

    res.status(200).json({
      success: true,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  getKey,
  verifyPayment,
};