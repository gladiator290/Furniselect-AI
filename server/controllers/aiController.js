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
      "http://127.0.0.1:8000/analyze-room",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );



    
    const aiData = aiResponse.data;



    
    const matchedProducts =
      await Product.find({
        tags: {
          $in: aiData.tags,
        },
      });



    
    res.status(200).json({

      ...aiData,

      recommendedProducts:
        matchedProducts,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "AI analysis failed",
    });
  }
};



module.exports = {
  analyzeRoom,
};