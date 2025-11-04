import { useEffect, useState, useContext } from "react";
import Header from "../../components/Header";
import backgroundImage from "../../assets/backgr.jpg";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../auth/Authorization";
import { FaUser, FaLock, FaCheckCircle } from "react-icons/fa";
import { Circles } from "react-loading-icons";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      if (!toast.isActive(1))
        toast.error("Passwords do not match!", { toastId: 1 });
    } else if (!username || !password || !confirmPassword) {
      if (!toast.isActive(2))
        toast.error("Please fill all details!", { toastId: 2 });
    } else {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE}/auth/signup`, {
          username,
          password,
        });
        navigate("/guest/home");
        login(res.data);
      } catch (err) {
        if (err.response?.status === 400) toast.error(err.response.data.detail);
        else {
          console.error(err);
          toast.error("Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    }
  };

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
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-emerald-900/60 to-teal-900/70"></div>

        {/* Signup Card */}
        <div className="absolute top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10 flex flex-col items-center animate-fadeIn">
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
            Create Account
          </h2>
          <p className="text-gray-200 text-sm mb-10">
            Join the adventure with <span className="text-emerald-300">Wanderers</span> 🌍
          </p>

          {/* Username */}
          <div className="relative w-full mb-6">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" />
            <input
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              className="peer w-full bg-white/10 border border-white/30 rounded-xl py-3.5 px-12 text-white placeholder-transparent focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300 outline-none transition-all duration-300"
            />
            <label className="absolute left-12 top-3 text-gray-300 text-sm transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-1/2 peer-focus:top-3 peer-focus:text-sm peer-focus:text-emerald-300">
              Username
            </label>
          </div>

          {/* Password */}
          <div className="relative w-full mb-6">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              type="password"
              className="peer w-full bg-white/10 border border-white/30 rounded-xl py-3.5 px-12 text-white placeholder-transparent focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300 outline-none transition-all duration-300"
            />
            <label className="absolute left-12 top-3 text-gray-300 text-sm transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-1/2 peer-focus:top-3 peer-focus:text-sm peer-focus:text-emerald-300">
              Password
            </label>
          </div>

          {/* Confirm Password */}
          <div className="relative w-full mb-8">
            <FaCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" />
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=" "
              type="password"
              className="peer w-full bg-white/10 border border-white/30 rounded-xl py-3.5 px-12 text-white placeholder-transparent focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300 outline-none transition-all duration-300"
            />
            <label className="absolute left-12 top-3 text-gray-300 text-sm transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-1/2 peer-focus:top-3 peer-focus:text-sm peer-focus:text-emerald-300">
              Confirm Password
            </label>
          </div>

          {/* Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-3.5 font-semibold rounded-xl text-white text-lg transition-all duration-300
              ${
                loading
                  ? "bg-gradient-to-r from-emerald-700 to-teal-700 opacity-70 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:scale-[1.03] hover:shadow-emerald-400/30 shadow-lg"
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
                <span>Creating...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center w-full my-8">
            <div className="flex-1 border-t border-white/30"></div>
            <span className="px-4 text-gray-300 text-sm">OR</span>
            <div className="flex-1 border-t border-white/30"></div>
          </div>

          {/* Login Link */}
          <div className="text-center text-gray-200 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-300 font-semibold hover:text-emerald-200 hover:underline transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default Signup;
