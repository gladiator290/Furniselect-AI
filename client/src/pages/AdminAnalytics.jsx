import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

import { useEffect, useState } from "react";
import axios from "axios";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAnalytics();
  }, [year]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `https://furniselect-ai.onrender.com/api/admin/analytics?year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Analytics Response:", JSON.stringify(data, null, 2));

      setAnalytics(data);
    } catch (error) {
      console.log("Analytics Error:", error);

      console.log("Response:", JSON.stringify(error.response?.data, null, 2));
    }
  };

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading Analytics...</h2>
      </div>
    );
  }

  if (!analytics?.orderStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Analytics Data Not Available</h2>
      </div>
    );
  }

  const totalOrders = Object.values(analytics?.orderStats || {}).reduce(
    (a, b) => a + b,
    0,
  );

  const cancelRate = totalOrders
    ? (((analytics?.orderStats?.cancelled || 0) / totalOrders) * 100).toFixed(1)
    : 0;

  const returnRate = totalOrders
    ? (((analytics?.orderStats?.returned || 0) / totalOrders) * 100).toFixed(1)
    : 0;

  return (
    <div className="admin-theme min-h-screen bg-[#f6f1ea]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="text-[#8a6a50] uppercase tracking-[4px] font-semibold">
            Analytics
          </p>

          <h1 className="text-5xl font-black mt-4 text-[#2b1d14]">
            Business Intelligence
          </h1>

          <p className="mt-4 text-gray-600">
            Revenue, sales performance and business insights.
          </p>
          <div className="mt-6">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="
      bg-white
      border
      px-4
      py-3
      rounded-xl
      font-semibold
    "
            >
              <option value={2024}>2024</option>

              <option value={2025}>2025</option>

              <option value={2026}>2026</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <p className="text-gray-500">Delivered Revenue</p>

            <h2 className="text-4xl font-black mt-3 text-green-600">
              ₹{analytics?.deliveredRevenue || 0}
            </h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <p className="text-gray-500">Total Orders</p>

            <h2 className="text-4xl font-black mt-3">{totalOrders}</h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <p className="text-gray-500">Cancellation Rate</p>

            <h2 className="text-4xl font-black mt-3 text-red-600">
              {cancelRate}%
            </h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <p className="text-gray-500">Return Rate</p>

            <h2 className="text-4xl font-black mt-3 text-purple-600">
              {returnRate}%
            </h2>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6">Order Breakdown</h2>

          <div className="grid md:grid-cols-6 gap-5">
            <div className="bg-orange-500 text-white p-6 rounded-3xl">
              <p>Pending</p>
              <h2 className="text-4xl font-black mt-3">
                {analytics?.orderStats?.pending || 0}
              </h2>
            </div>

            <div className="bg-yellow-500 text-white p-6 rounded-3xl">
              <p>Confirmed</p>
              <h2 className="text-4xl font-black mt-3">
                {analytics?.orderStats?.confirmed || 0}
              </h2>
            </div>

            <div className="bg-blue-500 text-white p-6 rounded-3xl">
              <p>Shipped</p>
              <h2 className="text-4xl font-black mt-3">
                {analytics?.orderStats?.shipped || 0}
              </h2>
            </div>

            <div className="bg-green-500 text-white p-6 rounded-3xl">
              <p>Delivered</p>
              <h2 className="text-4xl font-black mt-3">
                {analytics?.orderStats?.delivered || 0}
              </h2>
            </div>

            <div className="bg-red-500 text-white p-6 rounded-3xl">
              <p>Cancelled</p>
              <h2 className="text-4xl font-black mt-3">
                {analytics?.orderStats?.cancelled || 0}
              </h2>
            </div>

            <div className="bg-purple-500 text-white p-6 rounded-3xl">
              <p>Returned</p>
              <h2 className="text-4xl font-black mt-3">
                {analytics?.orderStats?.returned || 0}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm mb-10">
          <h2 className="text-3xl font-bold mb-6">Top Categories</h2>

          <div className="space-y-4">
            {analytics?.topCategories?.map((category, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-3"
              >
                <p className="font-semibold text-lg">{category[0]}</p>

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl">
                  {category[1]} Sold
                </span>
              </div>
            ))}

            {analytics?.topCategories?.length === 0 && (
              <p className="text-gray-500">No category analytics available</p>
            )}
          </div>
        </div>
        {/* CHARTS SECTION */}

        <div className="bg-white p-8 rounded-3xl shadow-sm mb-10">
          <h2 className="text-3xl font-bold mb-6">Monthly Revenue Trend</h2>

          <Line
            data={{
              labels: analytics.monthlyRevenue?.map((item) => item.month) || [],

              datasets: [
                {
                  label: "Revenue",

                  data:
                    analytics.monthlyRevenue?.map((item) => item.revenue) || [],

                  borderColor: "#16a34a",

                  tension: 0.4,
                },
              ],
            }}
          />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mb-10">
          <h2 className="text-3xl font-bold mb-6">Order Status Distribution</h2>

          <Bar
            data={{
              labels:
                analytics.orderStatusData?.map((item) => item.status) || [],

              datasets: [
                {
                  label: "Orders",

                  data:
                    analytics.orderStatusData?.map((item) => item.count) || [],
                },
              ],
            }}
          />
        </div>

        {/* BUSINESS INSIGHTS */}

        <div className="bg-gradient-to-r from-[#8a6a50] to-[#5d4037] text-white rounded-3xl p-10">
          <h2 className="text-3xl font-bold mb-8">Business Insights</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="opacity-80">Best Category</p>

              <h3 className="text-2xl font-black mt-2">
                {analytics?.topCategories?.[0]?.[0] || "N/A"}
              </h3>
            </div>

            <div>
              <p className="opacity-80">Cancellation Rate</p>

              <h3 className="text-2xl font-black mt-2">{cancelRate}%</h3>
            </div>

            <div>
              <p className="opacity-80">Return Rate</p>

              <h3 className="text-2xl font-black mt-2">{returnRate}%</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
