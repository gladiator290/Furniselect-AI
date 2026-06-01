import { Link, useLocation } from "react-router-dom";

function Footer() {

  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin");

  if (isAdminPage) {
    return null;
  }

  return (

    <footer className="bg-[#1f1a17] text-white">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-4 gap-14">

          <div>

            <h2 className="text-3xl font-bold">
              FurniSelect
            </h2>

            <p className="mt-6 text-gray-400 leading-8">

              Premium furniture for modern homes.
              Discover timeless designs and AI-powered
              recommendations tailored to your space.

            </p>

          </div>

          <div>

            <h3 className="text-xl font-semibold">
              Quick Links
            </h3>

            <div className="mt-6 space-y-4 text-gray-400">

              <Link
                to="/"
                className="block hover:text-white transition"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="block hover:text-white transition"
              >
                Products
              </Link>

              <Link
                to="/ai-room"
                className="block hover:text-white transition"
              >
                AI Room Analyzer
              </Link>

              <Link
                to="/cart"
                className="block hover:text-white transition"
              >
                Cart
              </Link>

            </div>

          </div>

          <div>

            <h3 className="text-xl font-semibold">
              Customer Support
            </h3>

            <div className="mt-6 space-y-4 text-gray-400">

              <Link
                to="/help-center"
                className="block hover:text-white transition"
              >
                Help Center
              </Link>

              <Link
                to="/track-order"
                className="block hover:text-white transition"
              >
                Order Tracking
              </Link>

              <Link
                to="/returns-refunds"
                className="block hover:text-white transition"
              >
                Returns & Refunds
              </Link>

              <Link
                to="/shipping-info"
                className="block hover:text-white transition"
              >
                Shipping Information
              </Link>

              <Link
                to="/faqs"
                className="block hover:text-white transition"
              >
                FAQs
              </Link>

            </div>

          </div>

          <div>

            <h3 className="text-xl font-semibold">
              Contact
            </h3>

            <div className="mt-6 space-y-4 text-gray-400">

              <p>
                support@furniselect.com
              </p>

              <p>
                +91 7651971774
              </p>

              <p>
                Uttar Pradesh, India
              </p>

            </div>

          </div>

        </div>

        <div className="border-t border-gray-700 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">

          <p className="text-gray-500 text-sm">
            © 2026 FurniSelect. All rights reserved.
          </p>

          <div className="flex gap-8 text-gray-400 text-sm">

            <a
              href="#"
              className="hover:text-white transition"
            >
              Instagram
            </a>

            <a
              href="#"
              className="hover:text-white transition"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="hover:text-white transition"
            >
              Twitter
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;