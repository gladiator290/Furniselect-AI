import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Profile() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [addresses, setAddresses] = useState(userInfo?.addresses || []);

  const [showForm, setShowForm] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [houseNo, setHouseNo] = useState("");

  const [area, setArea] = useState("");

  const [city, setCity] = useState("");

  const [stateName, setStateName] = useState("");

  const [pincode, setPincode] = useState("");

  const logoutHandler = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("userInfo");

    navigate("/");
  };
  const resetForm = () => {
    setFullName("");
    setPhone("");
    setHouseNo("");
    setArea("");
    setCity("");
    setStateName("");
    setPincode("");
    setEditingIndex(null);
  };

  const saveAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      let response;

      if (editingIndex !== null) {
        response = await axios.put(
          `http://localhost:5000/api/auth/address/${editingIndex}`,
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
      } else {
        response = await axios.post(
          "http://localhost:5000/api/auth/address",
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
      }

      setAddresses(response.data.addresses);

      const updatedUser = {
        ...userInfo,
        addresses: response.data.addresses,
      };

      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      setShowForm(false);

      resetForm();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: editingIndex !== null ? "Address updated" : "Address added",
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Failed",
      });
    }
  };

  const editAddress = (address, index) => {
    setEditingIndex(index);

    setFullName(address.fullName);

    setPhone(address.phone);

    setHouseNo(address.houseNo);

    setArea(address.area);

    setCity(address.city);

    setStateName(address.state);

    setPincode(address.pincode);

    setShowForm(true);
  };

  const deleteAddress = async (index) => {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:5000/api/auth/address/${index}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newAddresses = addresses.filter((_, i) => i !== index);

    setAddresses(newAddresses);

    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        ...userInfo,
        addresses: newAddresses,
      }),
    );
  };

  if (!userInfo) {
    navigate("/login");

    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-10 shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-[#7b4f2c] text-white text-5xl font-bold flex items-center justify-center">
              {userInfo.name?.charAt(0)?.toUpperCase()}
            </div>

            <h1 className="text-3xl font-bold mt-6">{userInfo.name}</h1>

            <p className="text-gray-500 mt-2">{userInfo.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md mt-8">
          <h2 className="text-2xl font-bold">Account Information</h2>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-gray-500">Full Name</p>

              <p className="font-semibold">{userInfo.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>

              <p className="font-semibold">{userInfo.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md mt-8">
          <h2 className="text-2xl font-bold">Saved Addresses</h2>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="mt-4 bg-[#7b4f2c] text-white px-6 py-3 rounded-xl"
          >
            + Add New Address
          </button>

          <div className="mt-6 space-y-4">
            {addresses.map((address, index) => (
              <div key={index} className="border p-4 rounded-xl">
                <p>{address.fullName}</p>

                <p>{address.phone}</p>

                <p>
                  {address.houseNo}, {address.area}
                </p>

                <p>
                  {address.city}, {address.state}
                </p>

                <p>{address.pincode}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => editAddress(address, index)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteAddress(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showForm && (
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
                placeholder="Phone Number"
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
                className="bg-[#7b4f2c] text-white py-4 rounded-xl md:col-span-2"
              >
                {editingIndex !== null ? "Update Address" : "Save Address"}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md mt-8">
          <h2 className="text-2xl font-bold">Quick Actions</h2>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => navigate("/orders")}
              className="p-4 rounded-2xl bg-[#f5f5f5] text-left hover:bg-[#ececec]"
            >
              My Orders
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="p-4 rounded-2xl bg-[#f5f5f5] text-left hover:bg-[#ececec]"
            >
              Wishlist
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="p-4 rounded-2xl bg-[#f5f5f5] text-left hover:bg-[#ececec]"
            >
              Cart
            </button>

            <button
              onClick={logoutHandler}
              className="p-4 rounded-2xl bg-red-100 text-red-600 text-left hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
