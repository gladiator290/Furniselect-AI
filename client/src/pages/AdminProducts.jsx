import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function AdminProducts() {

  const [products, setProducts] =
    useState([]);

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts =
    async () => {

      try {

        const { data } =
          await axios.get(
            "https://furniselect-ai.onrender.com/api/products"
          );

        setProducts(data);

      } catch (error) {

        console.log(error);

      }
    };

  const handleDelete =
    async (id) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const result =
          await Swal.fire({
            title:
              "Delete Product?",
            text:
              "This action cannot be undone",
            icon:
              "warning",
            showCancelButton:
              true,
            confirmButtonColor:
              "#dc2626",
            cancelButtonColor:
              "#6b7280",
            confirmButtonText:
              "Yes, Delete",
          });

        if (
          !result.isConfirmed
        ) {
          return;
        }

        await axios.delete(
          `https://furniselect-ai.onrender.com/api/products/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchProducts();

        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text:
            "Product deleted successfully",
          confirmButtonColor:
            "#000",
        });

      } catch (error) {

        console.log(error);

        Swal.fire({
          icon: "error",
          title:
            "Delete Failed",
          text:
            error.response?.data
              ?.message ||
            "Failed to delete product",
          confirmButtonColor:
            "#000",
        });

      }
    };

  const totalProducts =
    products.length;

  const lowStockProducts =
    products.filter(
      (p) =>
        p.stock > 0 &&
        p.stock <= 5
    ).length;

  const outOfStockProducts =
    products.filter(
      (p) =>
        p.stock === 0
    ).length;

  return (

    <div className="min-h-screen bg-[#f6f1ea]">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold">

              Inventory Management

            </h1>

            <p className="text-gray-500 mt-2">

              Manage products and stock levels

            </p>

          </div>

          <Link
            to="/admin/add-product"
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
          >

            + Add Product

          </Link>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <p className="text-gray-500">

              Total Products

            </p>

            <h2 className="text-4xl font-black mt-2">

              {totalProducts}

            </h2>

          </div>

          <div className="bg-yellow-50 p-6 rounded-3xl shadow-sm">

            <p className="text-yellow-700">

              Low Stock

            </p>

            <h2 className="text-4xl font-black mt-2 text-yellow-700">

              {lowStockProducts}

            </h2>

          </div>

          <div className="bg-red-50 p-6 rounded-3xl shadow-sm">

            <p className="text-red-700">

              Out Of Stock

            </p>

            <h2 className="text-4xl font-black mt-2 text-red-700">

              {outOfStockProducts}

            </h2>

          </div>

        </div>
                {products.length === 0 ? (

          <div className="bg-white p-10 rounded-3xl shadow-sm text-center">

            <h2 className="text-2xl font-semibold">

              No Products Found

            </h2>

          </div>

        ) : (

          <div className="grid md:grid-cols-3 gap-8">

            {products.map(
              (product) => (

                <div
                  key={product._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
                >

                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-6">

                    <h2 className="text-2xl font-bold">

                      {product.title}

                    </h2>

                    <p className="text-gray-500 mt-2">

                      {product.category}

                    </p>

                    <p className="font-bold text-xl mt-3">

                      ₹{product.price}

                    </p>

                    <div className="mt-4">

                      {product.stock === 0 ? (

                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">

                          Out Of Stock

                        </span>

                      ) : product.stock <= 5 ? (

                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">

                          Low Stock: {product.stock}

                        </span>

                      ) : (

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                          Stock: {product.stock}

                        </span>

                      )}

                    </div>

                    <div className="flex gap-3 mt-6">

                      <Link
                        to={`/admin/edit-product/${product._id}`}
                        className="bg-blue-500 text-white px-5 py-3 rounded-xl hover:bg-blue-600 transition"
                      >

                        Edit

                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                        className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition"
                      >

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );
}

export default AdminProducts;