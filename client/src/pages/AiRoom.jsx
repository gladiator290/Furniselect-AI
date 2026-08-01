import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

function AiRoom() {
  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    "Reading the room geometry",
    "Checking furniture and spatial cues",
    "Mapping light, tone and materials",
    "Building your furniture edit",
  ];

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file of your room.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Please upload an image smaller than 8 MB.");
      return;
    }

    setImage(file);

    setPreview(URL.createObjectURL(file));

    setResult(null);

    setErrorMessage("");
  };

  useEffect(() => {
    if (!loading) {
      setAnalysisStep(0);
      return undefined;
    }

    const timer = setInterval(() => {
      setAnalysisStep((step) => (step + 1) % analysisSteps.length);
    }, 1200);

    return () => clearInterval(timer);
  }, [loading]);

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

      setErrorMessage("");

      const formData = new FormData();

      formData.append("image", image);

      const { data } = await axios.post(
        "https://furniselect-ai.onrender.com/api/ai/analyze-room",
        formData,
      );

      setResult(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "We could not read this image. Please try a clearer room photo.";

      setErrorMessage(message);

      setResult(null);
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
            className="w-full rounded-xl border border-[#d8c8bb] bg-[#fbfaf8] p-4"
          />

          {preview && (
            <div className="relative mt-6 overflow-hidden rounded-2xl bg-[#211a16]">
              <img
                src={preview}
                alt="Uploaded room preview"
                className="max-h-[500px] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#d9a274]/10 to-transparent" />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#211a16]/45 backdrop-blur-[2px]">
                  <div className="w-[min(88%,520px)] rounded-2xl border border-[#d9a274]/45 bg-[#211a16]/85 p-5 text-white shadow-2xl">
                    <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[.18em] text-[#e2b080]">
                      <span>FurniSelect vision</span><span>SCAN 0{analysisStep + 1}/04</span>
                    </div>
                    <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/15"><div className="h-full w-1/3 animate-[scan_1.5s_ease-in-out_infinite] rounded-full bg-[#d9a274]" /></div>
                    <p className="mt-4 text-sm text-white/80">{analysisSteps[analysisStep]}</p>
                    <div className="mt-4 grid grid-cols-4 gap-2">{analysisSteps.map((step, index) => <span key={step} className={`h-1 rounded-full ${index <= analysisStep ? "bg-[#d9a274]" : "bg-white/15"}`} />)}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="mt-5 rounded-2xl border border-[#e8b4a9] bg-[#fff5f3] p-4 text-sm text-[#9b3f31]">
              <p className="font-semibold">This image was not recognised as a room.</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full rounded-2xl py-4 text-lg font-semibold text-white transition ${
              loading
                ? "cursor-not-allowed bg-[#a99e95]"
                : "bg-[#9a6038] hover:bg-[#7d4829]"
            }`}
          >
            Analyze Room
          </button>
        </div>

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
                            className="min-w-[130px] flex-1 rounded-xl bg-[#9a6038] py-3 text-white transition hover:bg-[#7d4829]"
                          >
                            Add to Cart
                          </button>

                          <button
                            onClick={() => buyNow(product._id)}
                            className="min-w-[130px] flex-1 rounded-xl border border-[#9a6038] py-3 text-[#9a6038] transition hover:bg-[#fbf4ef]"
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
