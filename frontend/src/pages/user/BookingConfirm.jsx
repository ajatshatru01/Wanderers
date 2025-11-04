import { useContext, useEffect } from "react";
import { SearchContext } from "./SearchContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaPlaneDeparture,
  FaRupeeSign,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../auth/Authorization";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function BookingConfirm() {
  const { data } = useContext(SearchContext);
  const [searchParams] = useSearchParams();
  const package_id = searchParams.get("package_id");
  const package_name = searchParams.get("package_name");
  const package_type = searchParams.get("package_type");
  const package_price = parseFloat(searchParams.get("package_price")) || 0;
  const package_location = searchParams.get("package_location");
  const package_duration = searchParams.get("package_duration") || "N/A";

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const totalPeople = data?.people || 1;
  const totalPrice = package_price * totalPeople;

  const handleConfirm = async () => {
    try {
      await axios.post(`${API_BASE}/bookings/`, {
        user_id: user.id,
        package_id,
        total_people: totalPeople,
      });
      navigate("/guest/home?booking=true");
    } catch (err) {
      navigate("/guest/home?booking=false");
    }
  };

  useEffect(() => {
    if (!data) navigate("/guest/home?booking=false");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <Header />
      <main className="fixed inset-0 top-20 flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden">
        <div className="relative max-w-xl w-full bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-[0_0_30px_rgba(0,255,200,0.1)] overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,200,0.2)]">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-5 flex items-center justify-between relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-2 rounded-lg shadow-inner">
                <FaPlaneDeparture className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{package_name || "Unknown Package"}</h2>
                <p className="text-xs text-gray-200 font-medium uppercase tracking-wide">
                  {package_type
                    ? package_type.charAt(0).toUpperCase() + package_type.slice(1)
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="text-right relative z-10">
              <p className="text-xs text-gray-200">Per Person</p>
              <p className="text-xl font-extrabold flex items-center justify-end gap-1">
                <FaRupeeSign className="w-4 h-4" />
                {package_price.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                  <FaMapMarkerAlt className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-300 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-semibold text-white">{package_location || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <FaUsers className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-300 uppercase tracking-wider">Travellers</p>
                  <p className="text-sm font-semibold text-white">
                    {totalPeople} {totalPeople === 1 ? "Person" : "People"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <FaPlaneDeparture className="text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase tracking-wider">Duration</p>
                <p className="text-sm font-semibold text-white">
                  {package_duration} days
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20"></div>

            {/* Price Summary */}
            <div className="flex justify-between items-center bg-gradient-to-r from-slate-800 to-gray-900 border border-white/20 rounded-2xl p-5">
              <div>
                <p className="text-sm text-gray-300">Total Amount</p>
                <p className="text-xs text-gray-400">
                  ₹{package_price.toLocaleString()} × {totalPeople}{" "}
                  {totalPeople === 1 ? "person" : "people"}
                </p>
              </div>
              <p className="text-2xl font-bold text-teal-400 flex items-center gap-1 drop-shadow-[0_0_10px_rgba(0,255,200,0.4)]">
                <FaRupeeSign className="w-5 h-5" />
                {totalPrice.toLocaleString()}
              </p>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="group relative w-full bg-gradient-to-r from-teal-500 via-emerald-600 to-green-500 text-white font-extrabold text-lg py-4 rounded-2xl shadow-[0_0_25px_rgba(0,255,150,0.4)] border border-teal-400 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(0,255,150,0.6)] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <MdVerified className="w-6 h-6 text-white drop-shadow-lg group-hover:rotate-[360deg] transition-all duration-700" />
              <span className="tracking-wide relative z-10">CONFIRM BOOKING</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default BookingConfirm;
