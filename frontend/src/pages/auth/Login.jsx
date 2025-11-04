import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import backgroundImage from "../../assets/backgr.jpg";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../auth/Authorization";
import { FaUser, FaLock } from "react-icons/fa";
import { Circles } from "react-loading-icons";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/guest/home");
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      if (!toast.isActive(1))
        toast.error("Please fill all details!", { toastId: 1 });
    } else {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE}/auth/login`, {
          username,
          password,
        });
        if (res.data.role === "guest") navigate("/guest/home");
        else navigate("/admin/dashboard");
        login(res.data);
      } catch (err) {
        if (err.response?.status === 401) toast.error(err.response.data.detail);
        else {
          console.error(err);
          toast.error("Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
      <main className="relative w-full h-screen overflow-hidden">
        <ToastContainer position="top-center" autoClose={2500} />
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-teal-900/60 to-emerald-900/70"></div>

        {/* Login Card */}
        <div className="absolute top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10 flex flex-col items-center animate-fadeIn">
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
            Welcome Back
          </h2>
          <p className="text-gray-200 text-sm mb-10">
            Sign in to continue your journey 🌍
          </p>

          {/* Username */}
          <div className="relative w-full mb-6">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-300" />
            <input
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              className="peer w-full bg-white/10 border border-white/30 rounded-xl py-3.5 px-12 text-white placeholder-transparent focus:border-teal-400 focus:ring-2 focus:ring-teal-300 outline-none transition-all duration-300"
            />
            <label className="absolute left-12 top-3 text-gray-300 text-sm transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-1/2 peer-focus:top-3 peer-focus:text-sm peer-focus:text-teal-300">
              Username
            </label>
          </div>

          {/* Password */}
          <div className="relative w-full mb-8">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-300" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              type="password"
              className="peer w-full bg-white/10 border border-white/30 rounded-xl py-3.5 px-12 text-white placeholder-transparent focus:border-teal-400 focus:ring-2 focus:ring-teal-300 outline-none transition-all duration-300"
            />
            <label className="absolute left-12 top-3 text-gray-300 text-sm transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-1/2 peer-focus:top-3 peer-focus:text-sm peer-focus:text-teal-300">
              Password
            </label>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-3.5 font-semibold rounded-xl text-white text-lg transition-all duration-300
              ${
                loading
                  ? "bg-gradient-to-r from-teal-700 to-emerald-700 opacity-70 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 hover:scale-[1.03] hover:shadow-teal-400/30 shadow-lg"
              }`}
          >
            {loading ? (
              <>
                <Circles
                  height="1.5em"
                  width="1.5em"
                  stroke="#fff"
                  strokeWidth={4}
                />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center w-full my-8">
            <div className="flex-1 border-t border-white/30"></div>
            <span className="px-4 text-gray-300 text-sm">OR</span>
            <div className="flex-1 border-t border-white/30"></div>
          </div>

          {/* Signup Link */}
          <div className="text-center text-gray-200 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-300 font-semibold hover:text-teal-200 hover:underline transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;
