const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses || [],
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );


    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses || [],
      token,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

const addAddress = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      fullName,
      phone,
      houseNo,
      area,
      city,
      state,
      pincode,
    } = req.body;

    if (!user.addresses) {
      user.addresses = [];
    }


    user.addresses.push({
      fullName,
      phone,
      houseNo,
      area,
      city,
      state,
      pincode,

      isDefault:
        user.addresses.length === 0,
    });

    await user.save();


    res.status(201).json({
      message:
        "Address added successfully",
      addresses:
        user.addresses,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};

const deleteAddress = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    const index =
      Number(
        req.params.index
      );

    user.addresses.splice(
      index,
      1
    );

    await user.save();

    res.status(200).json({
      message:
        "Address deleted",
      addresses:
        user.addresses,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
const editAddress = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const index =
      Number(
        req.params.index
      );

    if (
      index < 0 ||
      index >= user.addresses.length
    ) {
      return res.status(400).json({
        message:
          "Invalid address index",
      });
    }

    const {
      fullName,
      phone,
      houseNo,
      area,
      city,
      state,
      pincode,
    } = req.body;

    user.addresses[index] = {
      ...user.addresses[index]._doc,

      fullName,
      phone,
      houseNo,
      area,
      city,
      state,
      pincode,
    };

    await user.save();

    res.status(200).json({
      message:
        "Address updated successfully",
      addresses:
        user.addresses,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
  addAddress,
  editAddress,
  deleteAddress,
};