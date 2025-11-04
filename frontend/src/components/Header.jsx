import { useNavigate, Link } from "react-router-dom";
import companyLogo from "../assets/Logo.png";
import { AuthContext } from "../auth/Authorization";
import { useContext } from "react";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role === "guest") navigate("/guest/home");
    else if (user.role === "admin") navigate("/admin/dashboard");
    else navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-fuchsia-600 backdrop-blur-2xl flex justify-between items-center h-20 px-10 border-b border-white/20">

        {/* Company Logo */}
        <img
          src={companyLogo}
          onClick={handleLogoClick}
          alt="Company Logo"
          className="w-38 h-auto cursor-pointer drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-transform duration-300 hover:scale-110 active:scale-95"
        />

        {/* Logged In Section */}
        {user ? (
          <div className="flex gap-10 items-center">
            <div className="text-white font-semibold text-2xl tracking-wide drop-shadow-lg">
              Welcome,{" "}
              <span className="text-cyan-300 font-bold">
                {user.username}
              </span>
            </div>

            {/* Admin Links */}
            {user.role === "admin" && (
              <div className="flex gap-6">
                <Link
                  to="/admin/managepackages"
                  className="px-5 py-2 rounded-xl bg-white/10 border border-white/30 text-white font-medium hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300"
                >
                  Manage Packages
                </Link>

                <Link
                  to="/admin/managestaff"
                  className="px-5 py-2 rounded-xl bg-white/10 border border-white/30 text-white font-medium hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300"
                >
                  Manage Staff
                </Link>

                <Link
                  to="/admin/manageguests"
                  className="px-5 py-2 rounded-xl bg-white/10 border border-white/30 text-white font-medium hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300"
                >
                  Manage Guests
                </Link>
              </div>
            )}

            {/* Logout Button */}
            <Link
              to="/"
              onClick={logout}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold shadow-md hover:shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:scale-105 transition-all duration-300"
            >
              Logout
            </Link>
          </div>
        ) : (
          /* Logged Out Section */
          <div className="flex gap-6 items-center">
            <Link
              to="/signup"
              className="px-5 py-2 rounded-xl border border-white/40 text-white font-medium hover:bg-white/10 hover:border-white/70 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300"
            >
              Register
            </Link>

            <Link
              to="/"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
