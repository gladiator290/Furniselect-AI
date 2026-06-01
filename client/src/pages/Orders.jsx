import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Orders() {
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");

        return;
      }

      const { data } = await axios.get("https://furniselect-ai.onrender.com/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const requestCancel = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Cancel Order",
      input: "text",
      inputLabel: "Reason for cancellation",
      inputPlaceholder: "Enter reason...",
      confirmButtonColor: "#7b4f2c",
      showCancelButton: true,
    });

    if (!reason || reason.trim().length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Reason",
        text: "Reason must be at least 10 characters",
        confirmButtonColor: "#7b4f2c",
      });

      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://furniselect-ai.onrender.com/api/orders/${id}/cancel-request`,
        {
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchOrders();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: "Failed to send cancel request",
        confirmButtonColor: "#7b4f2c",
      });
    }
  };

  const requestReturn = async (id) => {
    const reason = prompt("Enter return reason (minimum 10 characters)");

    if (!reason || reason.trim().length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Reason",
        text: "Reason must be at least 10 characters",
        confirmButtonColor: "#7b4f2c",
      });

      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://furniselect-ai.onrender.com/api/orders/${id}/return-request`,
        {
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchOrders();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: "Failed to send return request",
        confirmButtonColor: "#7b4f2c",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Confirmed":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Returned":
        return "bg-purple-100 text-purple-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTrackingStep = (status) => {
    switch (status) {
      case "Pending":
        return 1;

      case "Confirmed":
        return 2;

      case "Shipped":
        return 3;

      case "Delivered":
        return 4;

      default:
        return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
          <h2 className="text-2xl font-semibold">No Orders Yet 😔</h2>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const currentStep = getTrackingStep(order.status);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-8 shadow-sm"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-gray-500">Order ID</p>

                    <p className="font-semibold break-all">{order._id}</p>
                  </div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-xl font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Tracking */}

                {["Pending", "Confirmed", "Shipped", "Delivered"].includes(
                  order.status,
                ) && (
                  <div className="mb-8">
                    <div className="flex justify-between">
                      {["Pending", "Confirmed", "Shipped", "Delivered"].map(
                        (step, index) => (
                          <div
                            key={step}
                            className="flex flex-col items-center flex-1"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                currentStep >= index + 1
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-200"
                              }`}
                            >
                              {index + 1}
                            </div>

                            <p className="text-sm mt-2">{step}</p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {order.cancelReason && (
                  <div className="mb-4 bg-red-50 p-4 rounded-xl">
                    <p className="font-semibold text-red-700">Cancel Reason</p>

                    <p>{order.cancelReason}</p>
                  </div>
                )}

                {order.returnReason && (
                  <div className="mb-4 bg-yellow-50 p-4 rounded-xl">
                    <p className="font-semibold text-yellow-700">
                      Return Reason
                    </p>

                    <p>{order.returnReason}</p>
                  </div>
                )}

                {order.refundStatus !== "Not Required" && (
                  <div className="mb-4">
                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl">
                      Refund: {order.refundStatus}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-6 border-b pb-4"
                    >
                      <img
                        src={item.product?.image}
                        alt={item.product?.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-xl">
                          {item.product?.title}
                        </h3>

                        <p className="text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="font-bold mt-2">₹{item.product?.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
                  <h2 className="text-2xl font-bold">
                    Total: ₹{order.totalPrice}
                  </h2>

                  <div className="flex gap-3 flex-wrap">
                    {(order.status === "Pending" ||
                      order.status === "Confirmed" ||
                      order.status === "Shipped") &&
                      !order.cancelRequest && (
                        <button
                          onClick={() => requestCancel(order._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl"
                        >
                          Request Cancel
                        </button>
                      )}

                    {order.cancelRequest && (
                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl">
                        Cancel Request Sent
                      </span>
                    )}

                    {order.status === "Delivered" && !order.returnRequest && (
                      <button
                        onClick={() => requestReturn(order._id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
                      >
                        Request Return
                      </button>
                    )}

                    {order.returnRequest && (
                      <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl">
                        Return Request Sent
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
