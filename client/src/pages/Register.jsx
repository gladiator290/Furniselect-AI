import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    if (
      !name ||
      !email ||
      !password
    ) {

      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields",
        confirmButtonColor: "#7b4f2c",
      });

      return;
    }

    try {

      const { data } =
        await axios.post(
          "https://furniselect-ai.onrender.com/api/auth/register",
          {
            name,
            email,
            password,
          }
        );

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      localStorage.setItem(
        "token",
        data.token
      );

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
        text:
          error.response?.data
            ?.message ||
          "Something went wrong",
        confirmButtonColor: "#7b4f2c",
      });

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">

      <div className="bg-white p-10 rounded-3xl shadow-sm w-full max-w-md">

        <h1 className="text-4xl font-bold mb-8 text-center">

          Create Account

        </h1>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-black"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-black"
          />

          <button
            type="submit"
            className="w-full bg-[#7b4f2c] text-white py-4 rounded-xl hover:bg-[#5c3b1e] transition"
          >

            Register

          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;