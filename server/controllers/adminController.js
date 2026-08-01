const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const SiteSettings = require("../models/SiteSettings");

const getDashboardStats = async (req, res) => {
  try {

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const totalCustomers =
      await User.countDocuments({
        role: "customer",
      });

    const deliveredOrders =
      await Order.find({
        status: "Delivered",
      });

    const totalRevenue =
      deliveredOrders.reduce(
        (acc, order) =>
          acc + order.totalPrice,
        0
      );

    const pendingOrders =
      await Order.countDocuments({
        status: "Pending",
      });

    const confirmedOrders =
      await Order.countDocuments({
        status: "Confirmed",
      });

    const shippedOrders =
      await Order.countDocuments({
        status: "Shipped",
      });

    const cancelledOrders =
      await Order.countDocuments({
        status: "Cancelled",
      });

    const returnedOrders =
      await Order.countDocuments({
        status: "Returned",
      });

    const refundPending =
      await Order.countDocuments({
        refundStatus: "Pending",
      });

    const lowStockProducts =
      await Product.countDocuments({
        stock: {
          $gt: 0,
          $lte: 5,
        },
      });

    const outOfStockProducts =
      await Product.countDocuments({
        stock: 0,
      });

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const todaysOrders =
      await Order.countDocuments({
        createdAt: {
          $gte: today,
        },
      });

    const recentOrders =
      await Order.find({})
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,

      pendingOrders,
      confirmedOrders,
      shippedOrders,

      cancelledOrders,
      returnedOrders,

      refundPending,

      lowStockProducts,
      outOfStockProducts,

      todaysOrders,

      recentOrders,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getAnalytics = async (req, res) => {

  try {

    const selectedYear =
      parseInt(req.query.year) ||
      new Date().getFullYear();

    const startDate =
      new Date(
        selectedYear,
        0,
        1
      );

    const endDate =
      new Date(
        selectedYear + 1,
        0,
        1
      );

    const orders =
      await Order.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      })
        .populate(
          "orderItems.product"
        );

    const deliveredRevenue =
      orders
        .filter(
          (o) =>
            o.status ===
            "Delivered"
        )
        .reduce(
          (acc, order) =>
            acc +
            order.totalPrice,
          0
        );

    const categoryMap = {};
    orders.forEach(
      (order) => {

        order.orderItems.forEach(
          (item) => {

            const category =
              item.product?.category ||
              "Unknown";

            categoryMap[category] =
              (
                categoryMap[
                category
                ] || 0
              ) +
              item.quantity;

          }
        );

      }
    );

    const analyticsPending =
      orders.filter(
        (o) =>
          o.status === "Pending"
      ).length;

    const analyticsConfirmed =
      orders.filter(
        (o) =>
          o.status === "Confirmed"
      ).length;

    const analyticsShipped =
      orders.filter(
        (o) =>
          o.status === "Shipped"
      ).length;

    const analyticsDelivered =
      orders.filter(
        (o) =>
          o.status === "Delivered"
      ).length;

    const analyticsCancelled =
      orders.filter(
        (o) =>
          o.status === "Cancelled"
      ).length;

    const analyticsReturned =
      orders.filter(
        (o) =>
          o.status === "Returned"
      ).length;

    const monthlyRevenue =
      await Order.aggregate([
        {
          $match: {
            status:
              "Delivered",

            createdAt: {
              $gte:
                startDate,
              $lt:
                endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              month: {
                $month:
                  "$createdAt",
              },
            },
            revenue: {
              $sum:
                "$totalPrice",
            },
          },
        },
        {
          $sort: {
            "_id.month":
              1,
          },
        },
      ]);

    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const completeRevenueData =
      [
        {
          month: "Jan",
          revenue: 0,
        },
        {
          month: "Feb",
          revenue: 0,
        },
        {
          month: "Mar",
          revenue: 0,
        },
        {
          month: "Apr",
          revenue: 0,
        },
        {
          month: "May",
          revenue: 0,
        },
        {
          month: "Jun",
          revenue: 0,
        },
        {
          month: "Jul",
          revenue: 0,
        },
        {
          month: "Aug",
          revenue: 0,
        },
        {
          month: "Sep",
          revenue: 0,
        },
        {
          month: "Oct",
          revenue: 0,
        },
        {
          month: "Nov",
          revenue: 0,
        },
        {
          month: "Dec",
          revenue: 0,
        },
      ];

    const formattedMonthlyRevenue =
      monthlyRevenue.map(
        (item) => ({
          month:
            monthNames[
            item._id.month
            ],

          revenue:
            item.revenue,
        })
      );

    formattedMonthlyRevenue.forEach(
      (item) => {

        const index =
          completeRevenueData.findIndex(
            (m) =>
              m.month ===
              item.month
          );

        if (
          index !== -1
        ) {

          completeRevenueData[
            index
          ].revenue =
            item.revenue;

        }

      }
    );

    const orderStatusData = [
      {
        status:
          "Pending",
        count:
          analyticsPending,
      },
      {
        status:
          "Confirmed",
        count:
          analyticsConfirmed,
      },
      {
        status:
          "Shipped",
        count:
          analyticsShipped,
      },
      {
        status:
          "Delivered",
        count:
          analyticsDelivered,
      },
      {
        status:
          "Cancelled",
        count:
          analyticsCancelled,
      },
      {
        status:
          "Returned",
        count:
          analyticsReturned,
      },
    ];

    const topCategories =
      Object.entries(
        categoryMap
      )
        .sort(
          (a, b) =>
            b[1] - a[1]
        )
        .slice(0, 5);
    res.status(200).json({

      year:
        selectedYear,

      deliveredRevenue,

      orderStats: {

        pending:
          analyticsPending,

        confirmed:
          analyticsConfirmed,

        shipped:
          analyticsShipped,

        delivered:
          analyticsDelivered,

        cancelled:
          analyticsCancelled,

        returned:
          analyticsReturned,

      },

      topCategories,

      monthlyRevenue:
        completeRevenueData,

      orderStatusData,

    });

  } catch (error) {

    console.error(
      "Analytics Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });

  }
};

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateUserRole = async (req, res) => {
  try {
    const allowedRoles = ["customer", "salesman", "admin"];
    if (!allowedRoles.includes(req.body.role)) return res.status(400).json({ message: "Invalid user role" });
    if (req.params.id === req.user._id.toString() && req.body.role !== "admin") return res.status(400).json({ message: "You cannot remove your own admin access" });
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAdminReviews = async (req, res) => {
  try {
    const products = await Product.find({ "reviews.0": { $exists: true } }).select("title image reviews").populate("reviews.user", "name email");
    const reviews = products.flatMap((product) => product.reviews.map((review) => ({ _id: review._id, productId: product._id, productTitle: product.title, productImage: product.image, name: review.name || review.user?.name || "Customer", email: review.user?.email || "", rating: review.rating, comment: review.comment, createdAt: review.createdAt })));
    res.status(200).json(reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteAdminReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const before = product.reviews.length;
    product.reviews = product.reviews.filter((review) => review._id.toString() !== req.params.reviewId);
    if (product.reviews.length === before) return res.status(404).json({ message: "Review not found" });
    product.numReviews = product.reviews.length;
    product.averageRating = product.numReviews ? product.reviews.reduce((total, review) => total + review.rating, 0) / product.numReviews : 0;
    await product.save();
    res.status(200).json({ message: "Review removed" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({ key: "store" }, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.status(200).json(settings);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateSiteSettings = async (req, res) => {
  try {
    const updates = { storeName: String(req.body.storeName || "FurniSelect").trim(), supportEmail: String(req.body.supportEmail || "").trim(), supportPhone: String(req.body.supportPhone || "").trim(), announcement: String(req.body.announcement || "").trim(), lowStockThreshold: Math.max(0, Number(req.body.lowStockThreshold) || 0) };
    const settings = await SiteSettings.findOneAndUpdate({ key: "store" }, updates, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    res.status(200).json(settings);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
  getDashboardStats,
  getAnalytics,
  getAdminUsers,
  updateUserRole,
  getAdminReviews,
  deleteAdminReview,
  getSiteSettings,
  updateSiteSettings,
};
