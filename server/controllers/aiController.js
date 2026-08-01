const axios = require("axios");

const FormData = require("form-data");

const Product = require("../models/Product");



const analyzeRoom = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: "No image uploaded",
      });
    }




    const formData = new FormData();

    formData.append(
      "image",
      req.file.buffer,
      req.file.originalname
    );




    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/analyze-room`, 
      formData,
      {
        headers: formData.getHeaders(),
      }
    );




    const aiData = aiResponse.data;




    const products =
      await Product.find();

    const scoredProducts =
      products.map((product) => {

        let score = 0;

        product.tags.forEach((tag) => {

          if (
            aiData.tags.includes(tag)
          ) {

            score++;
          }
        });

        return {

          ...product.toObject(),

          matchScore: score,
        };
      });

    const matchedProducts =
      scoredProducts

        .filter(
          (product) =>
            product.matchScore > 0
        )

        .sort(
          (a, b) =>
            b.matchScore -
            a.matchScore
        )

        .slice(0, 6);




    res.status(200).json({

      ...aiData,

      recommendedProducts:
        matchedProducts,
    });

  } catch (error) {

    console.log(error);

    if (error.response?.status === 422) {
      return res.status(422).json({
        code: error.response.data?.detail?.code || "NOT_A_ROOM",
        message:
          error.response.data?.detail?.message ||
          "This does not look like a room image. Please upload a room photo.",
      });
    }

    res.status(500).json({
      message: "AI analysis failed",
    });
  }
};



module.exports = {
  analyzeRoom,
};
