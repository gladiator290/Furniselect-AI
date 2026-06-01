import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminEditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState(null);

  const [currentImage, setCurrentImage] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `https://furniselect-ai.onrender.com/api/products/${id}`,
      );

      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setCategory(data.category);
      setMaterial(data.material || "");
      setColor(data.color || "");
      setDimensions(data.dimensions || "");
      setStock(data.stock || 1);

      setCurrentImage(data.image);

      setLoading(false);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Load Failed",
        text: "Failed to load product",
        confirmButtonColor: "#000",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !category) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields",
        confirmButtonColor: "#000",
      });

      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", title);

      formData.append("description", description);

      formData.append("price", price);

      formData.append("category", category);

      formData.append("material", material);

      formData.append("color", color);

      formData.append("dimensions", dimensions);

      formData.append("stock", stock);

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `https://furniselect-ai.onrender.com/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("UPDATE RESPONSE:", response.data);

      await Swal.fire({
        icon: "success",
        title: "Product Updated 🎉",
        text: `${title} updated successfully`,
        confirmButtonColor: "#000",
      });

      navigate("/admin/products");
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update product",
        confirmButtonColor: "#000",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold mb-10">Edit Product</h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-3xl shadow-sm space-y-5"
      >
        {currentImage && (
          <div>
            <p className="font-semibold mb-3">Current Image</p>

            <img
              src={currentImage}
              alt="Product"
              className="w-48 h-48 object-cover rounded-2xl border"
            />
          </div>
        )}

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-4 rounded-xl"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-4 rounded-xl h-32"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="Material"
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Color"
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          placeholder="Dimensions"
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          className="w-full border p-4 rounded-xl"
        />

        <button
          type="submit"
          className="bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}

export default AdminEditProduct;
