import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields",
        confirmButtonColor: "#7b4f2c",
      });

      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Passwords do not match",
        confirmButtonColor: "#7b4f2c",
      });

      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be at least 6 characters",
        confirmButtonColor: "#7b4f2c",
      });

      return;
    }

    try {
      const { data } = await axios.post(
        "https://furniselect-ai.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        },
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      localStorage.setItem("token", data.token);

      await Swal.fire({
        icon: "success",
        title: "Account Created 🎉",
        text: `Welcome ${data.name}`,
        confirmButtonColor: "#7b4f2c",
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#7b4f2c",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f0] to-[#efe7dc] px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center">Create Account </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Join FurniSelect and start exploring smart furniture
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-black"
          />

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
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-[#7b4f2c]"
          />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </div>
          <p className="text-center mt-5 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#7b4f2c] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-[#7b4f2c] text-white py-4 rounded-xl hover:bg-[#5c3b1e] transition font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
