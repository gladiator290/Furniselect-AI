import { useEffect, useState } from "react";
import axios from "axios";
import {
  Link,
  useLocation,
} from "react-router-dom";

function Products() {

  const [products, setProducts] =
    useState([]);

  const location = useLocation();

  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          const searchParams =
            new URLSearchParams(
              location.search
            );

          const search =
            searchParams.get(
              "search"
            ) || "";

          const { data } =
            await axios.get(
              `https://furniselect-ai.onrender.com/api/products?search=${search}`
            );

          setProducts(data);

        } catch (error) {

          console.log(error);
        }
      };

    fetchProducts();

  }, [location.search]);

  return (

    <div className="max-w-7xl mx-auto px-6 py-12">

      <h2 className="text-4xl font-bold mb-10">

        Our Collection

      </h2>

      {products.length === 0 ? (

        <div className="text-center text-2xl text-gray-500 mt-20">

          No products found 😔

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {products.map(
            (product) => (

              <Link
                to={`/products/${product._id}`}
                key={product._id}
              >

                <div className="bg-[#fffaf3] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300">

                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-72 object-cover"
                  />

                  <div className="p-6">

                    <h3 className="text-2xl font-semibold">

                      {product.title}

                    </h3>

                    <p className="text-gray-500 mt-2">

                      {product.category}

                    </p>

                    <div className="mt-5 flex items-center justify-between">

                      <span className="text-xl font-bold">

                        ₹{product.price}

                      </span>

                      <button className="bg-[#7b4f2c] text-white px-5 py-2 rounded-xl hover:bg-[#5c3b1e] transition">

                        View Product

                      </button>

                    </div>

                  </div>

                </div>

              </Link>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default Products;