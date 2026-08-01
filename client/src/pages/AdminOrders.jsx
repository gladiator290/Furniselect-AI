import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState("Pending");

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const { data } =
        await axios.get(
          "https://furniselect-ai.onrender.com/api/orders/admin",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setOrders(data);

    } catch (error) {

      console.log(error);
    }
  };

  const approveOrder =
    async (orderId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `https://furniselect-ai.onrender.com/api/orders/admin/${orderId}/approve`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  const rejectOrder =
    async (orderId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `https://furniselect-ai.onrender.com/api/orders/admin/${orderId}/reject`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  const shipOrder =
    async (orderId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `https://furniselect-ai.onrender.com/api/orders/admin/${orderId}/ship`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  const deliverOrder =
    async (orderId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `https://furniselect-ai.onrender.com/api/orders/admin/${orderId}/deliver`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  const adminCancel =
    async (orderId) => {

      try {

        const reason =
          prompt(
            "Cancellation reason (optional)"
          );

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `https://furniselect-ai.onrender.com/api/orders/admin/${orderId}/cancel`,
          {
            reason,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  const approveCancel =
    async (orderId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `https://furniselect-ai.onrender.com/api/orders/admin/${orderId}/approve-cancel`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  const rejectCancel =
    async (orderId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `https://furniselect-ai.onrender.com/api/orders/admin/${orderId}/reject-cancel`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  const approveReturn =
    async (orderId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `https://furniselect-ai.onrender.com/api/orders/admin/${orderId}/approve-return`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  const rejectReturn =
    async (orderId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `https://furniselect-ai.onrender.com/api/orders/admin/${orderId}/reject-return`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  const getStatusColor =
    (status) => {

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

  const filteredOrders =
    orders.filter((order) => {

      const matchesSearch =
        order._id
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      if (
        activeTab ===
        "Cancel Requests"
      ) {

        return (
          order.cancelRequest &&
          matchesSearch
        );
      }

      if (
        activeTab ===
        "Return Requests"
      ) {

        return (
          order.returnRequest &&
          matchesSearch
        );
      }

      return (
        order.status ===
          activeTab &&
        matchesSearch
      );
    });

      return (

    <div className="admin-theme max-w-7xl mx-auto px-6 py-12">

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-bold">
            Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer orders
          </p>

        </div>

        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm">

          <p className="text-gray-500 text-sm">
            Total Orders
          </p>

          <h2 className="text-3xl font-bold">
            {orders.length}
          </h2>

        </div>

      </div>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-5 mb-10">

        <div className="flex flex-wrap gap-3">

          {[
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancel Requests",
            "Return Requests",
            "Cancelled",
            "Returned",
            "Rejected",
          ].map((status) => {

            let count = 0;

            if (
              status ===
              "Cancel Requests"
            ) {

              count =
                orders.filter(
                  (o) =>
                    o.cancelRequest
                ).length;

            } else if (
              status ===
              "Return Requests"
            ) {

              count =
                orders.filter(
                  (o) =>
                    o.returnRequest
                ).length;

            } else {

              count =
                orders.filter(
                  (o) =>
                    o.status ===
                    status
                ).length;
            }

            return (

              <button
                key={status}
                onClick={() =>
                  setActiveTab(
                    status
                  )
                }
                className={`px-5 py-3 rounded-xl font-medium transition ${
                  activeTab ===
                  status
                    ? "bg-black text-white"
                    : "bg-white border"
                }`}
              >

                {status}

                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-200 text-black">

                  {count}

                </span>

              </button>

            );
          })}

        </div>

        <input
          type="text"
          placeholder="Search Order ID..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          className="border rounded-xl px-4 h-12 w-full lg:w-80 bg-white"
        />

      </div>

      <div className="space-y-6">

        {filteredOrders.map(
          (order) => (

            <div
              key={order._id}
              className="bg-white rounded-3xl shadow-sm p-8 border"
            >

              <div className="flex flex-col lg:flex-row justify-between gap-8">

                <div>

                  <h2 className="font-bold text-2xl">

                    Order #

                    {
                      order._id.slice(
                        -6
                      )
                    }

                  </h2>

                  <p className="text-gray-500 mt-1">

                    {new Date(
                      order.createdAt
                    ).toLocaleString()}

                  </p>

                  <div className="mt-5">

                    <p className="font-semibold">

                      Customer

                    </p>

                    <p>
                      {
                        order.user
                          ?.name
                      }
                    </p>

                    <p className="text-gray-500">

                      {
                        order.user
                          ?.email
                      }

                    </p>

                  </div>

                </div>

                <div className="lg:text-right">

                  <p className="text-gray-500">

                    Total Amount

                  </p>

                  <h2 className="text-4xl font-bold">

                    ₹
                    {
                      order.totalPrice
                    }

                  </h2>

                  <div className="mt-4">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >

                      {
                        order.status
                      }

                    </span>

                  </div>

                  {order.refundStatus !==
                    "Not Required" && (

                    <div className="mt-4">

                      <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl">

                        Refund:
                        {" "}
                        {
                          order.refundStatus
                        }

                      </span>

                    </div>

                  )}

                </div>

              </div>

              <div className="mt-8 border-t pt-6">

                <h3 className="font-bold text-lg mb-4">

                  Ordered Products

                </h3>

                <div className="space-y-3">

                  {order.orderItems?.map(
                    (item) => (

                      <div
                        key={item._id}
                        className="flex justify-between bg-gray-50 rounded-xl px-4 py-3"
                      >

                        <div>

                          <p className="font-medium">

                            {
                              item.product
                                ?.title
                            }

                          </p>

                          <p className="text-sm text-gray-500">

                            Category:
                            {" "}
                            {
                              item.product
                                ?.category
                            }

                          </p>

                        </div>

                        <div className="font-semibold">

                          Qty:
                          {" "}
                          {
                            item.quantity
                          }

                        </div>

                      </div>

                    )
                  )}

                </div>

                {order.cancelReason && (

                  <div className="mt-5 bg-red-50 p-4 rounded-xl">

                    <p className="font-semibold text-red-700">

                      Cancel Reason

                    </p>

                    <p>
                      {
                        order.cancelReason
                      }
                    </p>

                  </div>

                )}

                {order.returnReason && (

                  <div className="mt-5 bg-yellow-50 p-4 rounded-xl">

                    <p className="font-semibold text-yellow-700">

                      Return Reason

                    </p>

                    <p>
                      {
                        order.returnReason
                      }
                    </p>

                  </div>

                )}

                <div className="flex flex-wrap gap-3 mt-6">

                  {order.status ===
                    "Pending" && (

                    <>
                      <button
                        onClick={() =>
                          approveOrder(
                            order._id
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-xl"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          rejectOrder(
                            order._id
                          )
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Reject
                      </button>
                    </>

                  )}

                  {order.status ===
                    "Confirmed" && (

                    <>
                      <button
                        onClick={() =>
                          shipOrder(
                            order._id
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                      >
                        Ship
                      </button>

                      <button
                        onClick={() =>
                          adminCancel(
                            order._id
                          )
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Cancel
                      </button>
                    </>

                  )}

                  {order.status ===
                    "Shipped" && (

                    <>
                      <button
                        onClick={() =>
                          deliverOrder(
                            order._id
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-xl"
                      >
                        Deliver
                      </button>

                      <button
                        onClick={() =>
                          adminCancel(
                            order._id
                          )
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Cancel
                      </button>
                    </>

                  )}

                  {order.cancelRequest && (

                    <>
                      <button
                        onClick={() =>
                          approveCancel(
                            order._id
                          )
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Approve Cancel
                      </button>

                      <button
                        onClick={() =>
                          rejectCancel(
                            order._id
                          )
                        }
                        className="bg-gray-700 text-white px-4 py-2 rounded-xl"
                      >
                        Reject Cancel
                      </button>
                    </>

                  )}

                  {order.returnRequest && (

                    <>
                      <button
                        onClick={() =>
                          approveReturn(
                            order._id
                          )
                        }
                        className="bg-yellow-600 text-white px-4 py-2 rounded-xl"
                      >
                        Approve Return
                      </button>

                      <button
                        onClick={() =>
                          rejectReturn(
                            order._id
                          )
                        }
                        className="bg-gray-700 text-white px-4 py-2 rounded-xl"
                      >
                        Reject Return
                      </button>
                    </>

                  )}

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );
}

export default AdminOrders;
