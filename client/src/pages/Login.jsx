import { useState } from "react";
import axios from "axios";
import { useNavigate ,Link,
  useLocation,} from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter email and password",
        confirmButtonColor: "#000",
      });

      return;
    }

    try {
      const { data } = await axios.post(
        "https://furniselect-ai.onrender.com/api/auth/login",
        {
          email,
          password,
        },
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      if (data.role === "admin") {
        localStorage.setItem("viewMode", "admin");
      }

      localStorage.setItem("token", data.token);

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${data.name}`,
        confirmButtonColor: "#000",
      });

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#000",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f0] to-[#efe7dc] px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-black"
          />

          <button
            type="submit"
            className="w-full bg-[#7b4f2c] text-white py-4 rounded-xl hover:bg-[#5c3b1e] transition font-semibold"
          >
            Login
          </button>
          <p className="text-center mt-4 text-gray-600">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="text-[#7b4f2c] font-semibold hover:underline"
  >
    Create Account
  </Link>
</p>
        </form>
      </div>
    </div>
  );
}

export default Login;
