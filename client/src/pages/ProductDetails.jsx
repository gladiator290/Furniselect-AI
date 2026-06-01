import { useEffect, useState } from "react";
import axios from "axios";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [relatedProducts, setRelatedProducts] =
    useState([]);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        setProduct(data);

        const relatedResponse =
          await axios.get(
            `http://localhost:5000/api/products/${id}/related`
          );

        setRelatedProducts(
          relatedResponse.data
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/cart",
        {
          product: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to cart 😎");
    } catch (error) {
      console.log(error);

      alert("Failed to add product");
    }
  };

  const handleBuyNow = () => {

  navigate("/checkout", {
    state: {
      product,
      quantity: 1,
      buyNow: true,
    },
  });

};
  const handleReviewSubmit = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/products/${id}/review`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted 😎");

      window.location.reload();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to submit review"
      );
    }
  };

  if (!product) {
    return (
      <div className="text-center mt-20 text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5f0] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        
        <div className="grid lg:grid-cols-2 gap-16">
          
          
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[700px] object-cover rounded-3xl shadow-lg"
            />
          </div>

          
          
          <div>
            <p className="uppercase tracking-wider text-[#7b4f2c] font-semibold">
              {product.category}
            </p>

            <h1 className="text-5xl font-bold mt-4 text-[#2b1d14]">
              {product.title}
            </h1>

            <div className="mt-5 flex items-center gap-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                ⭐ {product.averageRating || 4.5}
              </span>

              <span className="text-gray-500">
                {product.numReviews || 0} Reviews
              </span>
            </div>

            <h2 className="text-5xl font-bold mt-8 text-[#7b4f2c]">
              ₹{product.price}
            </h2>

            <div className="mt-8 bg-white p-6 rounded-3xl shadow-md">
              <h3 className="font-bold text-2xl mb-5">
                Specifications
              </h3>

              <div className="space-y-3">
                <p>
                  <span className="font-semibold">
                    Material:
                  </span>{" "}
                  {product.material || "N/A"}
                </p>

                <p>
                  <span className="font-semibold">
                    Color:
                  </span>{" "}
                  {product.color || "N/A"}
                </p>

                <p>
                  <span className="font-semibold">
                    Dimensions:
                  </span>{" "}
                  {product.dimensions ||
                    "N/A"}
                </p>

                <p>
                  <span className="font-semibold">
                    Stock:
                  </span>{" "}
                  {product.stock}
                </p>
              </div>
            </div>

            {product.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {product.tags.map(
                  (tag, index) => (
                    <span
                      key={index}
                      className="bg-[#e7d7c9] text-[#5c3d2e] px-4 py-2 rounded-full"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            )}

            <div className="mt-10 flex gap-4">

  <button
    disabled={product.stock === 0}
    onClick={handleAddToCart}
    className={`px-8 py-4 rounded-xl transition ${
      product.stock === 0
        ? "bg-gray-400 cursor-not-allowed text-white"
        : "bg-black text-white hover:bg-gray-800"
    }`}
  >
    {product.stock === 0
      ? "Out Of Stock"
      : "Add To Cart"}
  </button>

  <button
    disabled={product.stock === 0}
    onClick={handleBuyNow}
    className={`px-8 py-4 rounded-xl transition ${
      product.stock === 0
        ? "bg-gray-400 cursor-not-allowed text-white"
        : "bg-[#7b4f2c] text-white hover:bg-[#5f3c20]"
    }`}
  >
    {product.stock === 0
      ? "Out Of Stock"
      : "Buy Now"}
  </button>

</div>
          </div>
        </div>

        
        
        <div className="mt-24 bg-white p-10 rounded-3xl shadow-md">
          <h2 className="text-3xl font-bold text-[#2b1d14]">
            About Product
          </h2>

          <p className="mt-6 text-gray-600 text-lg leading-9">
            {product.description}
          </p>
        </div>

        
        
        <div className="mt-16 bg-white p-10 rounded-3xl shadow-md">
          <h2 className="text-3xl font-bold text-[#2b1d14]">
            Customer Reviews
          </h2>

          {product.reviews?.length > 0 ? (
            <div className="mt-8 space-y-6">
              {product.reviews.map(
                (review) => (
                  <div
                    key={review._id}
                    className="border-b pb-6"
                  >
                    <h3 className="font-semibold text-xl">
                      {review.name}
                    </h3>

                    <p className="text-yellow-500 mt-2">
                      {"⭐".repeat(
                        review.rating
                      )}
                    </p>

                    <p className="mt-3 text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="mt-6 text-gray-500">
              No reviews yet.
            </p>
          )}
        </div>

        
        
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-[#2b1d14]">
            You May Also Like
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mt-8">
            {relatedProducts.map(
              (item) => (
                <Link
                  key={item._id}
                  to={`/products/${item._id}`}
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-56 object-cover"
                    />

                    <div className="p-5">
                      <h3 className="font-semibold text-lg">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 mt-2">
                        {item.category}
                      </p>

                      <p className="font-bold mt-3 text-[#7b4f2c]">
                        ₹{item.price}
                      </p>
                    </div>

                  </div>
                </Link>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;