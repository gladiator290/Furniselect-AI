import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AdminAddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !category || !image) {
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

      formData.append("image", image);

      await axios.post("https://furniselect-ai.onrender.com/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "Product added successfully",
        confirmButtonColor: "#000",
      });

      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setMaterial("");
      setColor("");
      setDimensions("");
      setImage(null);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to add product",
        confirmButtonColor: "#000",
      });
    }
  };

  return (
    <div className="admin-theme max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold mb-10">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-sm space-y-5"
      >
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-4 rounded-xl"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-4 rounded-xl h-32"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Dimensions"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-4 rounded-xl"
        />

        <button
          type="submit"
          className="bg-black text-white px-8 py-4 rounded-xl"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AdminAddProduct;
