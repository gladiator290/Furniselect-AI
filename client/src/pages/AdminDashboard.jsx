import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [stats, setStats] =
    useState({

      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,

      totalRevenue: 0,

      pendingOrders: 0,
      confirmedOrders: 0,
      shippedOrders: 0,

      cancelledOrders: 0,
      returnedOrders: 0,

      refundPending: 0,

      lowStockProducts: 0,
      outOfStockProducts: 0,

      todaysOrders: 0,

      recentOrders: [],
    });

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const { data } =
          await axios.get(
            "https://furniselect-ai.onrender.com/api/admin/dashboard",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setStats(data);

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div className="admin-theme min-h-screen bg-[#f6f1ea]">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="mb-12">

          <p className="text-[#8a6a50] uppercase tracking-[4px] font-semibold">

            Admin Panel

          </p>

          <h1 className="text-5xl font-black mt-4 text-[#2b1d14]">

            FurniSelect Dashboard

          </h1>

          <p className="mt-4 text-gray-600 text-lg">

            Complete business overview,
            inventory health, customer activity
            and revenue monitoring.

          </p>

        </div>

        {/* MAIN STATS */}

        <div className="grid md:grid-cols-5 gap-6 mb-8">

          <div className="bg-white p-8 rounded-3xl shadow-sm">

            <p className="text-gray-500">
              Revenue
            </p>

            <h2 className="text-4xl font-black mt-3 text-green-600">

              ₹{stats.totalRevenue}

            </h2>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">

            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-4xl font-black mt-3">

              {stats.totalOrders}

            </h2>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">

            <p className="text-gray-500">
              Customers
            </p>

            <h2 className="text-4xl font-black mt-3">

              {stats.totalCustomers}

            </h2>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">

            <p className="text-gray-500">
              Products
            </p>

            <h2 className="text-4xl font-black mt-3">

              {stats.totalProducts}

            </h2>

          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-3xl shadow-lg">

            <p className="opacity-80">
              Today's Orders
            </p>

            <h2 className="text-5xl font-black mt-3">

              {stats.todaysOrders}

            </h2>

          </div>

        </div>

        {/* ORDER STATUS */}

        <div className="grid md:grid-cols-5 gap-6 mb-8">

          <div className="bg-orange-500 text-white p-6 rounded-3xl">

            <p>Pending</p>

            <h2 className="text-4xl font-black mt-3">

              {stats.pendingOrders}

            </h2>

          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-3xl">

            <p>Confirmed</p>

            <h2 className="text-4xl font-black mt-3">

              {stats.confirmedOrders}

            </h2>

          </div>

          <div className="bg-blue-500 text-white p-6 rounded-3xl">

            <p>Shipped</p>

            <h2 className="text-4xl font-black mt-3">

              {stats.shippedOrders}

            </h2>

          </div>

          <div className="bg-red-500 text-white p-6 rounded-3xl">

            <p>Cancelled</p>

            <h2 className="text-4xl font-black mt-3">

              {stats.cancelledOrders}

            </h2>

          </div>

          <div className="bg-purple-500 text-white p-6 rounded-3xl">

            <p>Returned</p>

            <h2 className="text-4xl font-black mt-3">

              {stats.returnedOrders}

            </h2>

          </div>

        </div>

        {/* INVENTORY HEALTH */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white p-8 rounded-3xl shadow-sm border-l-4 border-purple-500">

            <p className="text-gray-500">

              Refund Pending

            </p>

            <h2 className="text-5xl font-black mt-3 text-purple-600">

              {stats.refundPending}

            </h2>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border-l-4 border-yellow-500">

            <p className="text-gray-500">

              Low Stock Products

            </p>

            <h2 className="text-5xl font-black mt-3 text-yellow-600">

              {stats.lowStockProducts}

            </h2>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border-l-4 border-red-500">

            <p className="text-gray-500">

              Out Of Stock

            </p>

            <h2 className="text-5xl font-black mt-3 text-red-600">

              {stats.outOfStockProducts}

            </h2>

          </div>

        </div>
                {/* MANAGEMENT */}

        <div className="grid md:grid-cols-4 gap-8">

          <Link
            to="/admin/products"
            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition block"
          >
            <div className="text-5xl">
              📦
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Products
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Manage furniture products and catalog.
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition block"
          >
            <div className="text-5xl">
              🛒
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Orders
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Approve, ship and manage customer orders.
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition block"
          >
            <div className="text-5xl">
              👥
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Customers
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              View registered users and customer activity.
            </p>
          </Link>
          
          <Link
            to="/admin/analytics"
            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition block"
          >
            <div className="text-5xl">
              📊
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Analytics
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Revenue, sales and business intelligence.
            </p>
          </Link>

          <Link
            to="/admin/reviews"
            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition block"
          >
            <div className="text-5xl">
              ⭐
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Reviews
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Customer feedback and product ratings.
            </p>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition block"
          >
            <div className="text-5xl">
              ⚙️
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Settings
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Configure platform and business settings.
            </p>
          </Link>

          <div className="bg-gradient-to-r from-[#8a6a50] to-[#5d4037] text-white rounded-3xl p-8">

            <div className="text-5xl">
              🚀
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Business Health
            </h2>

            <p className="mt-3 opacity-90 leading-7">
              Monitor revenue, orders and inventory from one place.
            </p>

          </div>

        </div>

        {/* RECENT ORDERS */}

        <div className="mt-16 bg-white rounded-3xl p-8 shadow-sm">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-3xl font-bold">

              Recent Orders

            </h2>

            <Link
              to="/admin/orders"
              className="text-[#8a6a50] font-semibold"
            >
              View All →
            </Link>

          </div>

          <div className="space-y-4">

            {stats.recentOrders?.map(
              (order) => (

                <div
                  key={order._id}
                  className="flex justify-between items-center border-b pb-4"
                >

                  <div>

                    <p className="font-semibold">

                      {order.user?.name}

                    </p>

                    <p className="text-xs text-gray-500">

                      {order.user?.email}

                    </p>

                    <p className="text-sm text-gray-500 mt-1">

                      Order #
                      {order._id.slice(-6)}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-bold text-lg">

                      ₹{order.totalPrice}

                    </p>

                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium
                      ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.status === "Returned"
                          ? "bg-purple-100 text-purple-700"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {order.status}

                    </span>

                  </div>

                </div>

              )
            )}

            {stats.recentOrders?.length === 0 && (

              <p className="text-gray-500">

                No recent orders available

              </p>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}

export default AdminDashboard;
