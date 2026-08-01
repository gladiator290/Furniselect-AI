import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Checkout() {
  const location = useLocation();

  const {
    product,
    quantity,
    cartItems = [],
    checkoutType,
  } = location.state || {};

  const isCartCheckout = checkoutType === "cart";

  const [qty, setQty] = useState(quantity || 1);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [addresses, setAddresses] = useState(userInfo?.addresses || []);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [houseNo, setHouseNo] = useState("");

  const [area, setArea] = useState("");

  const [city, setCity] = useState("");

  const [stateName, setStateName] = useState("");

  const [pincode, setPincode] = useState("");

  const totalPrice = isCartCheckout
    ? cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      )
    : product
      ? product.price * qty
      : 0;

  const saveAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "https://furniselect-ai.onrender.com/api/auth/address",
        {
          fullName,
          phone,
          houseNo,
          area,
          city,
          state: stateName,
          pincode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAddresses(data.addresses);

      const updatedUser = {
        ...JSON.parse(localStorage.getItem("userInfo")),

        addresses: data.addresses,
      };

      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      setShowAddressForm(false);

      Swal.fire({
        icon: "success",
        title: "Address Added",
        confirmButtonColor: "#7b4f2c",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to add address",
      });
    }
  };

  const handleCheckout = async () => {
    if (selectedAddress === null) {
      Swal.fire({
        icon: "warning",
        title: "Select Address",
        text: "Please select a delivery address",
        confirmButtonColor: "#7b4f2c",
      });

      return;
    }

    try {
      const { data: keyData } = await axios.get(
        "https://furniselect-ai.onrender.com/api/payment/key",
      );

      const { data: orderData } = await axios.post(
        "https://furniselect-ai.onrender.com/api/payment/create-order",
        {
          amount: totalPrice,
        },
      );
      const options = {
        key: keyData.key,

        amount: orderData.amount,

        currency: orderData.currency,

        name: "FurniSelect",

        description: "Furniture Purchase",

        order_id: orderData.id,

        handler: async function () {
          const token = localStorage.getItem("token");

          if (isCartCheckout) {
            await axios.post(
              "https://furniselect-ai.onrender.com/api/orders",
              {
                shippingAddress: addresses[selectedAddress],
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
          } else {
            await axios.post(
              "https://furniselect-ai.onrender.com/api/orders",
              {
                buyNowProduct: product._id,

                quantity: qty,

                shippingAddress: addresses[selectedAddress],
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
          }
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            confirmButtonColor: "#7b4f2c",
          }).then(() => {
            window.location.href = "/orders";
          });
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Checkout Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  if (!product && !isCartCheckout) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      {!isCartCheckout && (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <img
            src={product.image}
            alt={product.title}
            className="w-48 h-48 object-cover rounded-2xl"
          />

          <h2 className="text-3xl font-bold mt-4">{product.title}</h2>

          <p className="text-xl mt-3">₹{product.price}</p>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => {
                if (qty > 1) {
                  setQty(qty - 1);
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "Product Removed",
                    text: "Checkout is empty",
                    confirmButtonColor: "#7b4f2c",
                  }).then(() => {
                    window.history.back();
                  });
                }
              }}
              className="w-10 h-10 bg-gray-200 rounded-full"
            >
              -
            </button>

            <span className="text-xl font-bold">{qty}</span>

            <button
              onClick={() => {
                if (qty < product.stock) {
                  setQty(qty + 1);
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "Stock Limit Reached",
                    text: `Only ${product.stock} items available`,
                  });
                }
              }}
              className="w-10 h-10 bg-gray-200 rounded-full"
            >
              +
            </button>
          </div>

          <p className="mt-3">
            Stock:
            {product.stock}
          </p>

          <p className="mt-4 text-2xl font-bold">Total: ₹{totalPrice}</p>
        </div>
      )}

      {isCartCheckout && (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl p-5 shadow-sm">
              <div className="flex min-w-0 items-center gap-5">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-28 h-28 object-cover rounded-xl"
                />

                <div className="min-w-0">
                  <h2 className="break-words text-2xl font-bold">{item.product.title}</h2>

                  <p>
                    Qty:
                    {item.quantity}
                  </p>

                  <p className="font-bold">₹{item.product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">
        <h2 className="text-2xl font-bold mb-5">Select Delivery Address</h2>

        {addresses.length === 0 && (
          <p className="text-red-500 mb-4">
            No address found. Please add an address.
          </p>
        )}

        {addresses.map((address, index) => (
          <label
            key={index}
            className="border rounded-xl p-4 flex gap-3 mb-3 cursor-pointer"
          >
            <input
              type="radio"
              checked={selectedAddress === index}
              onChange={() => setSelectedAddress(index)}
            />

            <div>
              <p>{address.fullName}</p>

              <p>{address.phone}</p>

              <p>
                {address.houseNo},{address.area}
              </p>

              <p>
                {address.city},{address.state}
              </p>

              <p>{address.pincode}</p>
            </div>
          </label>
        ))}

        <button
          onClick={() => setShowAddressForm(!showAddressForm)}
          className="mt-4 rounded-xl border-2 border-[#9a6038] px-6 py-3 text-[#9a6038] hover:bg-[#fbf4ef]"
        >
          + Add New Address
        </button>
        {showAddressForm && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="House No"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="State"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="border p-4 rounded-xl md:col-span-2"
            />

            <button
              onClick={saveAddress}
              className="rounded-xl bg-[#9a6038] py-4 text-white hover:bg-[#7d4829] md:col-span-2"
            >
              Save Address
            </button>
          </div>
        )}

        <button
          onClick={handleCheckout}
          className="mt-6 rounded-xl bg-[#9a6038] px-8 py-4 text-white hover:bg-[#7d4829]"
        >
          Proceed To Payment
        </button>
      </div>
    </div>
  );
}

export default Checkout;
