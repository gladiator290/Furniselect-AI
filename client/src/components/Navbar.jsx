import {
  Link,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";

function Navbar() {

  const [showMenu, setShowMenu] =
    useState(false);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const location = useLocation();

  const isAdmin =
    userInfo?.role === "admin";

  const viewMode =
    localStorage.getItem("viewMode") ||
    "customer";

  useEffect(() => {

    setShowMenu(false);

  }, [location.pathname]);

  const logoutHandler = () => {

    localStorage.removeItem("token");

    localStorage.removeItem(
      "userInfo"
    );

    localStorage.removeItem(
      "viewMode"
    );

    window.location.href = "/";
  };

  const switchView = () => {

    const newMode =
      viewMode === "admin"
        ? "customer"
        : "admin";

    localStorage.setItem(
      "viewMode",
      newMode
    );

    if (newMode === "admin") {

      window.location.href =
        "/admin";

    } else {

      window.location.href = "/";
    }
  };

  return (

    <nav className="bg-[#efe7dc] shadow-sm border-b sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to={
            isAdmin &&
            viewMode === "admin"
              ? "/admin"
              : "/"
          }
          className="text-2xl font-bold tracking-wide text-black"
        >
          FurniSelect
        </Link>

        <div className="flex items-center gap-8 text-[15px] font-medium">

          {(!isAdmin ||
            viewMode === "customer") && (
            <>
              <Link
                to="/"
                className="hover:text-gray-500 transition"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="hover:text-gray-500 transition"
              >
                Products
              </Link>

              <Link
                to="/ai-room"
                className="hover:text-gray-500 transition"
              >
                AI Room
              </Link>

              <Link
                to="/cart"
                className="hover:text-gray-500 transition"
              >
                Cart
              </Link>
            </>
          )}

          {isAdmin &&
            viewMode === "admin" && (
              <>
                <Link
                  to="/admin"
                  className="hover:text-gray-500 transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/products"
                  className="hover:text-gray-500 transition"
                >
                  Products
                </Link>

                <Link
                  to="/admin/orders"
                  className="hover:text-gray-500 transition"
                >
                  Orders
                </Link>
              </>
            )}

          {!userInfo ? (

            <>
              <Link
                to="/login"
                className="bg-[#7b4f2c] text-white px-5 py-2 rounded-lg hover:bg-[#5c3b1e] transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hover:text-gray-500 transition"
              >
                Register
              </Link>
            </>

          ) : (

            <div className="flex items-center gap-4">

              {isAdmin && (

                <button
                  onClick={switchView}
                  className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm ${
                    viewMode === "admin"
                      ? "bg-[#7b4f2c] text-white"
                      : "bg-white border border-[#7b4f2c] text-[#7b4f2c]"
                  }`}
                >

                  {viewMode === "admin"
                    ? "👤 Customer View"
                    : "⚙️ Admin View"}

                </button>

              )}

              <div className="relative">

                <button
                  onClick={() =>
                    setShowMenu(
                      !showMenu
                    )
                  }
                  className="w-10 h-10 rounded-full bg-[#7b4f2c] text-white font-bold flex items-center justify-center"
                >

                  {userInfo.name
                    ?.charAt(0)
                    ?.toUpperCase()}

                </button>

                {showMenu && (

                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-lg border overflow-hidden">

                    <div className="px-4 py-3 border-b">

                      <p className="font-semibold">
                        {userInfo.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {userInfo.email}
                      </p>

                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      Wishlist
                    </Link>

                    <button
                      onClick={
                        logoutHandler
                      }
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;