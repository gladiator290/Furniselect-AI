const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {

    const { product, quantity } = req.body;

    const existingCartItem = await Cart.findOne({
      user: req.user._id,
      product,
    });

    if (existingCartItem) {

  const productData =
    await Product.findById(product);

  if (
    existingCartItem.quantity +
      (quantity || 1) >
    productData.stock
  ) {
    return res.status(400).json({
      message: "Stock limit exceeded",
    });
  }

  existingCartItem.quantity +=
    quantity || 1;

  await existingCartItem.save();

  return res.status(200).json(
    existingCartItem
  );
}

    const cartItem = await Cart.create({
      user: req.user._id,
      product,
      quantity,
    });

    res.status(201).json(cartItem);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const getCartItems = async (req, res) => {
  try {

    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate("product");

    res.status(200).json(cartItems);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {

    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    await cartItem.deleteOne();

    res.status(200).json({
      message: "Item removed from cart",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const increaseQuantity = async (req, res) => {
  try {

    const cartItem =
      await Cart.findById(
        req.params.id
      ).populate("product");

    if (!cartItem) {
      return res.status(404).json({
        message:
          "Cart item not found",
      });
    }

    if (
      cartItem.quantity >=
      cartItem.product.stock
    ) {
      return res.status(400).json({
        message:
          "Maximum stock reached",
      });
    }

    cartItem.quantity += 1;

    await cartItem.save();

    res.status(200).json(
      cartItem
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};

const decreaseQuantity = async (req, res) => {
  try {

    const cartItem =
      await Cart.findById(
        req.params.id
      );

    if (!cartItem) {
      return res.status(404).json({
        message:
          "Cart item not found",
      });
    }

    if (
      cartItem.quantity <= 1
    ) {
      return res.status(400).json({
        message:
          "Minimum quantity is 1",
      });
    }

    cartItem.quantity -= 1;

    await cartItem.save();

    res.status(200).json(
      cartItem
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
};