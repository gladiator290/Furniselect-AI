import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

function AiRoom() {
  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) {
      Swal.fire({
        icon: "warning",
        title: "No Image Selected",
        text: "Please upload a room image first",
        confirmButtonColor: "#5c3d2e",
      });

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", image);

      const { data } = await axios.post(
        "https://furniselect-ai.onrender.com/api/ai/analyze-room",
        formData,
      );

      setResult(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");

        return;
      }

      await axios.post(
        "https://furniselect-ai.onrender.com/api/cart",

        {
          product: productId,
          quantity: 1,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await Swal.fire({
        icon: "success",
        title: "Added To Cart",
        text: "Product added successfully",
        confirmButtonColor: "#5c3d2e",
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to add to cart",
        confirmButtonColor: "#5c3d2e",
      });
    }
  };

  const buyNow = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");

        return;
      }

      await axios.post(
        "https://furniselect-ai.onrender.com/api/cart",

        {
          product: productId,
          quantity: 1,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/cart");
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Buy now failed",
        confirmButtonColor: "#5c3d2e",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1eb] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-[#3e2f25]">
          AI Room Analyzer
        </h1>

        <p className="text-center mt-4 text-gray-600 text-lg">
          Upload your room image and get smart furniture recommendations
        </p>

        <div className="mt-12 bg-white rounded-3xl p-8 shadow-lg">
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full border p-4 rounded-xl"
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-6 w-full max-h-[500px] object-cover rounded-2xl"
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full text-white py-4 rounded-2xl text-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5c3d2e] hover:bg-[#4a3125]"
            }`}
          >
            Analyze Room
          </button>
        </div>

        {loading && (
          <div className="mt-10 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5c3d2e] mx-auto"></div>

            <p className="mt-4 text-lg text-gray-700">
              AI analyzing your room...
            </p>
          </div>
        )}

        {result && (
          <>
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-[#3e2f25]">
                  Room Analysis
                </h2>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-[#f8f5f0] p-4 rounded-2xl">
                    <p className="text-sm text-gray-500">Style</p>
                    <p className="font-bold text-lg">{result.style}</p>
                  </div>

                  <div className="bg-[#f8f5f0] p-4 rounded-2xl">
                    <p className="text-sm text-gray-500">Room Type</p>
                    <p className="font-bold text-lg">{result.room_type}</p>
                  </div>

                  <div className="bg-[#f8f5f0] p-4 rounded-2xl">
                    <p className="text-sm text-gray-500">Tone</p>
                    <p className="font-bold text-lg">{result.tone}</p>
                  </div>

                  <div className="bg-[#f8f5f0] p-4 rounded-2xl">
                    <p className="text-sm text-gray-500">Mood</p>
                    <p className="font-bold text-lg">{result.mood}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Confidence</span>

                    <span>{result.confidence}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#5c3d2e] h-3 rounded-full"
                      style={{
                        width: `${result.confidence}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-3">Color Palette</h3>

                  <div className="flex gap-3">
                    {result.palette?.map((color, index) => (
                      <div
                        key={index}
                        title={color}
                        className="w-12 h-12 rounded-xl border"
                        style={{
                          backgroundColor: color,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {result.recommendedProducts &&
            result.recommendedProducts.length > 0 ? (
              <div className="mt-16">
                <h2 className="text-4xl font-bold text-[#3e2f25]">
                  Recommended Products
                </h2>

                <div className="grid md:grid-cols-3 gap-8 mt-8">
                  {result.recommendedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-72 object-cover"
                      />

                      <div className="p-6">
                        <h3 className="text-2xl font-semibold">
                          {product.title}
                        </h3>

                        <p className="mt-2 text-gray-600">{product.category}</p>

                        <p className="mt-4 text-2xl font-bold text-[#5c3d2e]">
                          ₹{product.price}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-[#f1e4d8] text-[#5c3d2e] px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => addToCart(product._id)}
                            className="flex-1 bg-[#5c3d2e] text-white py-3 rounded-xl hover:bg-[#4a3125] transition"
                          >
                            Add to Cart
                          </button>

                          <button
                            onClick={() => buyNow(product._id)}
                            className="flex-1 border border-[#5c3d2e] text-[#5c3d2e] py-3 rounded-xl hover:bg-[#f3ebe3] transition"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-16">
                <h2 className="text-4xl font-bold text-[#3e2f25]">
                  Recommended Products
                </h2>

                <div className="bg-white rounded-3xl p-8 shadow-lg mt-8 text-center">
                  <p className="text-xl text-gray-600">
                    No related products found for this room style.
                  </p>
                </div>
              </div>
            )}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mt-16">
                <h2 className="text-4xl font-bold text-[#3e2f25]">
                  AI Recommendations
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  {result.recommendations.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-3xl p-6 shadow-lg"
                    >
                      <h3 className="text-xl font-semibold text-[#5c3d2e]">
                        {item}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}{" "}
          </>
        )}
      </div>
    </div>
  );
}

export default AiRoom;
