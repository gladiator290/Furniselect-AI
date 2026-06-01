const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const placeOrder = async (req, res) => {
  try {

    if (req.body.buyNowProduct) {

      const product =
        await Product.findById(
          req.body.buyNowProduct
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      if (
        product.stock <
        req.body.quantity
      ) {
        return res.status(400).json({
          message:
            "Out of stock",
        });
      }

      const order =
        await Order.create({
          user:
            req.user._id,

          orderItems: [
            {
              product:
                product._id,

              quantity:
                req.body.quantity,
            },
          ],

          totalPrice:
            product.price *
            req.body.quantity,

          shippingAddress:
            req.body
              .shippingAddress,

          timeline: [
            {
              status:
                "Pending",
            },
          ],
        });

      product.stock -=
        req.body.quantity;

      await product.save();

      return res.status(201).json(
        order
      );

    }

    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    for (const item of cartItems) {

      if (!item.product) {
        return res.status(400).json({
          message: "Product not found",
        });
      }

      if (
        item.product.stock <
        item.quantity
      ) {
        return res.status(400).json({
          message: `${item.product.title} is out of stock`,
        });
      }
    }

    const orderItems =
      cartItems.map((item) => ({
        product:
          item.product._id,
        quantity:
          item.quantity,
      }));

    const totalPrice =
      cartItems.reduce(
        (acc, item) =>
          acc +
          item.product.price *
          item.quantity,
        0
      );

    const order =
      await Order.create({
        user:
          req.user._id,
        orderItems,
        totalPrice,
        shippingAddress:
          req.body
            .shippingAddress,

        timeline: [
          {
            status:
              "Pending",
          },
        ],
      });

    for (const item of cartItems) {

      item.product.stock -=
        item.quantity;

      await item.product.save();
    }

    await Cart.deleteMany({
      user:
        req.user._id,
    });

    res.status(201).json(order);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

const getMyOrders = async (
  req,
  res
) => {
  try {

    const orders =
      await Order.find({
        user:
          req.user._id,
      }).populate(
        "orderItems.product"
      );

    res.status(200).json(
      orders
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

const getAllOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find({})
          .populate(
            "user",
            "name email"
          )
          .populate(
            "orderItems.product"
          );

      res.status(200).json(
        orders
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const approveOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.status =
        "Confirmed";

      await order.save();

      res.status(200).json(
        order
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const rejectOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        ).populate(
          "orderItems.product"
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      for (const item of order.orderItems) {

        item.product.stock +=
          item.quantity;

        await item.product.save();
      }

      order.status =
        "Rejected";

      order.refundStatus =
        "Pending";

      await order.save();

      res.status(200).json(
        order
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const shipOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.status =
        "Shipped";

      await order.save();

      res.status(200).json(
        order
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const deliverOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.status =
        "Delivered";

      await order.save();

      res.status(200).json(
        order
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const adminCancelOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        ).populate(
          "orderItems.product"
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      for (const item of order.orderItems) {

        item.product.stock +=
          item.quantity;

        await item.product.save();
      }

      order.status =
        "Cancelled";

      order.refundStatus =
        "Pending";

      order.adminCancelReason =
        req.body.reason || "";

      await order.save();

      res.status(200).json(
        order
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const requestCancelOrder =
  async (req, res) => {

    try {

      const {
        reason,
      } = req.body;

      if (
        !reason ||
        reason.trim()
          .length < 10
      ) {
        return res.status(400).json({
          message:
            "Minimum 10 characters required",
        });
      }

      const order =
        await Order.findById(
          req.params.id
        );

      order.cancelRequest =
        true;

      order.cancelReason =
        reason;

      await order.save();

      res.status(200).json({
        message:
          "Cancel request submitted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const requestReturnOrder =
  async (req, res) => {

    try {

      const {
        reason,
      } = req.body;

      if (
        !reason ||
        reason.trim()
          .length < 10
      ) {
        return res.status(400).json({
          message:
            "Minimum 10 characters required",
        });
      }

      const order =
        await Order.findById(
          req.params.id
        );

      order.returnRequest =
        true;

      order.returnReason =
        reason;

      await order.save();

      res.status(200).json({
        message:
          "Return request submitted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const approveCancelOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        ).populate(
          "orderItems.product"
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      for (const item of order.orderItems) {

        item.product.stock +=
          item.quantity;

        await item.product.save();
      }

      order.status =
        "Cancelled";

      order.cancelRequest =
        false;

      order.refundStatus =
        "Pending";

      await order.save();

      res.status(200).json({
        message:
          "Cancel request approved",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const rejectCancelOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.cancelRequest =
        false;

      order.cancelReason =
        "";

      await order.save();

      res.status(200).json({
        message:
          "Cancel request rejected",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const approveReturnOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        ).populate(
          "orderItems.product"
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      for (const item of order.orderItems) {

        item.product.stock +=
          item.quantity;

        await item.product.save();
      }

      order.status =
        "Returned";

      order.returnRequest =
        false;

      order.refundStatus =
        "Pending";

      await order.save();

      res.status(200).json({
        message:
          "Return request approved",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const rejectReturnOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.returnRequest =
        false;

      order.returnReason =
        "";

      await order.save();

      res.status(200).json({
        message:
          "Return request rejected",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  placeOrder,

  getMyOrders,
  getAllOrders,

  approveOrder,
  rejectOrder,

  shipOrder,
  deliverOrder,

  adminCancelOrder,

  requestCancelOrder,
  requestReturnOrder,

  approveCancelOrder,
  rejectCancelOrder,

  approveReturnOrder,
  rejectReturnOrder,
};