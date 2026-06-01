import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get("https://furniselect-ai.onrender.com/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems(data);

        

        
      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  
  const increaseQuantity = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://furniselect-ai.onrender.com/api/cart/increase/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { data } = await axios.get("https://furniselect-ai.onrender.com/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(data);
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: error.response?.data?.message || "Failed",
      });
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://furniselect-ai.onrender.com/api/cart/decrease/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { data } = await axios.get("https://furniselect-ai.onrender.com/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(data);
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: error.response?.data?.message || "Failed",
      });
    }
  };
  const handleCheckout = () => {

  navigate("/checkout", {
    state: {
      cartItems,
      checkoutType: "cart",
    },
  });

};

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">Your Cart is Empty 🛒</h2>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl p-5 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-32 h-32 object-cover rounded-2xl"
                  />

                  <div>
                    <h2 className="text-2xl font-semibold">
                      {item.product.title}
                    </h2>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="w-8 h-8 rounded-full bg-gray-200"
                      >
                        -
                      </button>

                      <span className="font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="w-8 h-8 rounded-full bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Stock:
                      {item.product.stock}
                    </p>

                    <p className="text-xl font-bold mt-3">
                      ₹{item.product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>


          <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Total: ₹{totalPrice}</h2>

            <button
              onClick={handleCheckout}
              className="mt-6 bg-[#7b4f2c] text-white px-8 py-4 rounded-xl hover:bg-[#5c3b1e] transition"
            >
              Proceed To Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
