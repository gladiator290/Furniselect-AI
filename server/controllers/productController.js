const Product = require("../models/Product");

const cloudinary = require("../config/cloudinary");

const streamifier = require("streamifier");

const axios = require("axios");

const FormData = require("form-data");





const createProduct = async (req, res) => {

  try {

    let imageUrl = "";

    let detectedTags = [];



    if (req.file) {

      console.log(req.file);



      
      const streamUpload = () => {

        return new Promise((resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "furniselect-products",
              },

              (error, result) => {

                if (result) {

                  resolve(result);

                } else {

                  reject(error);
                }
              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        });
      };



      
      const result = await streamUpload();

      imageUrl = result.secure_url;



      
      const formData = new FormData();

      formData.append(
        "image",
        req.file.buffer,
        req.file.originalname
      );



      
try {

  const aiResponse =
    await axios.post(
      "http://127.0.0.1:8000/analyze-room",
      formData,
      {
        headers:
          formData.getHeaders(),
      }
    );

  detectedTags =
    aiResponse.data.tags || [];

} catch (error) {

  console.log(
    "AI Server Not Running"
  );

  detectedTags = [];
}
      }




    
    const product = await Product.create({

      ...req.body,

      image: imageUrl,

      tags: detectedTags,
    });



    res.status(201).json(product);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};





const getProducts = async (req, res) => {
  try {

    const keyword = req.query.search
      ? {
          $or: [
            {
              title: {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              category: {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              tags: {
                $regex: req.query.search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const products =
      await Product.find(keyword);

    res.status(200).json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};




const getSingleProduct = async (req, res) => {

  try {

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};





const updateProduct = async (req, res) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });
    }

    let imageUrl =
      product.image;

    if (req.file) {

      const streamUpload =
        () => {

          return new Promise(
            (
              resolve,
              reject
            ) => {

              const stream =
                cloudinary.uploader.upload_stream(
                  {
                    folder:
                      "furniselect-products",
                  },

                  (
                    error,
                    result
                  ) => {

                    if (result) {

                      resolve(
                        result
                      );

                    } else {

                      reject(
                        error
                      );
                    }
                  }
                );

              streamifier
                .createReadStream(
                  req.file.buffer
                )
                .pipe(stream);
            }
          );
        };

      const result =
        await streamUpload();

      imageUrl =
        result.secure_url;
    }

    product.title =
      req.body.title ||
      product.title;

    product.description =
      req.body.description ||
      product.description;

    product.price =
      req.body.price ||
      product.price;

    product.category =
      req.body.category ||
      product.category;

    product.material =
      req.body.material ||
      product.material;

    product.color =
      req.body.color ||
      product.color;

    product.dimensions =
      req.body.dimensions ||
      product.dimensions;

    product.stock =
      req.body.stock ||
      product.stock;

    product.image =
      imageUrl;

    const updatedProduct =
      await product.save();

    res.status(200).json(
      updatedProduct
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};




const deleteProduct = async (req, res) => {

  try {

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message:
        "Product deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const addReview = async (req, res) => {

  try {

    const { rating, comment } = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadyReviewed =
      product.reviews.find(
        (review) =>
          review.user.toString() ===
          req.user._id.toString()
      );

    if (alreadyReviewed) {

      return res.status(400).json({
        message:
          "You already reviewed this product",
      });
    }

    const review = {

      user: req.user._id,

      name: req.user.name,

      rating: Number(rating),

      comment,
    };

    product.reviews.push(review);

    product.numReviews =
      product.reviews.length;

    product.averageRating =
      product.reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    res.status(201).json({
      message:
        "Review added successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


const getRelatedProducts = async (req, res) => {

  try {

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });
    }

    const relatedProducts =
      await Product.find({

        category: product.category,

        _id: {
          $ne: product._id,
        },

      }).limit(4);

    res.status(200).json(
      relatedProducts
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};





module.exports = {

  createProduct,

  getProducts,

  getSingleProduct,

  updateProduct,

  deleteProduct,

  addReview,

  getRelatedProducts,
};