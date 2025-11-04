import { useState, useContext } from "react";
import Header from "../../components/Header";
import backgroundImage from "../../assets/backgr.jpg";
import { AuthContext } from "../../auth/Authorization";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { SearchContext } from "./SearchContext";
import "react-toastify/dist/ReactToastify.css";
import UserBookings from "./UserBookings";

// --------------------
// Home Page (Search Packages)
// --------------------
function Home() {
  const { user } = useContext(AuthContext);
  const { data, setData } = useContext(SearchContext);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!location && !type) {
      toast.error("Please enter a location or select a package type!");
      return;
    }

    setData({ location, type });
    navigate(`/guest/searchresults?location=${location}&type=${type}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

      <Header />
      <ToastContainer />

      <div className="relative flex flex-col justify-center items-center text-center text-white pt-32 px-6">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Welcome, {user?.username || "Traveler"}!
        </h1>
        <p className="text-lg mb-10 text-gray-200 max-w-2xl">
          Discover breathtaking destinations and unforgettable experiences crafted just for you.
        </p>

        {/* ✅ Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white/20 backdrop-blur-lg p-6 rounded-3xl flex flex-col sm:flex-row gap-4 w-full max-w-3xl shadow-xl border border-white/20"
        >
          <input
            type="text"
            placeholder="Enter destination..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-4 rounded-xl flex-1 bg-white/80 text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-cyan-300 outline-none"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-4 rounded-xl bg-white/80 text-gray-800 focus:ring-4 focus:ring-cyan-300 outline-none"
          >
            <option value="">Select Type</option>
            <option value="Adventure">Adventure</option>
            <option value="Romantic">Romantic</option>
            <option value="Family">Family</option>
            <option value="Cultural">Cultural</option>
          </select>

          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg"
          >
            Search
          </button>
        </form>

        {/* ✅ Booked Packages Button */}
        <div className="mt-10">
          <Link
            to="/guest/booked"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-lg"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

// --------------------
// UserHome Page (Booked Packages)
// --------------------
export function UserHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="pt-24 max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Booked Packages
        </h2>

        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100">
          <UserBookings />
        </div>
      </div>
    </div>
  );
}

export default Home;
