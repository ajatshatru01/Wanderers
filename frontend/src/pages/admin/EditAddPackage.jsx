import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  FaSuitcaseRolling,
  FaRupeeSign,
  FaSave,
  FaPlus,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function EditAddPackage() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get("for");
  const id = searchParams.get("id");
  const nameParam = searchParams.get("name");
  const typeParam = searchParams.get("type");
  const locationParam = searchParams.get("location");
  const priceParam = searchParams.get("price");
  const slotParam = searchParams.get("slot");
  const durationParam = searchParams.get("duration");

  const [name, setName] = useState(nameParam || "");
  const [type, setType] = useState(typeParam || "");
  const [location, setLocation] = useState(locationParam || "");
  const [price, setPrice] = useState(priceParam || "");
  const [slot, setSlot] = useState(slotParam || "");
  const [duration, setDuration] = useState(durationParam || "");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleEdit = async () => {
    if (!name || !type || !location || !price || !slot || !duration) {
      toast.error("Please fill all fields!");
      return;
    }
    try {
      await axios.put(`${API_BASE}/packages/${id}`, {
        name,
        type,
        location,
        price,
        slot,
        duration,
      });
      navigate("/admin/managepackages?action=update");
    } catch (err) {
      if (err.response?.status === 400) toast.warn(err.response.data.detail);
      else {
        console.error(err);
        if (!toast.isActive(1)) toast.error("Unexpected Error", { toastId: 1 });
      }
    }
  };

  const handleAdd = async () => {
    if (!name || !type || !location || !price || !slot || !duration) {
      toast.error("Please fill all fields!");
      return;
    }
    try {
      await axios.post(`${API_BASE}/packages/`, {
        name,
        type,
        location,
        price,
        slot,
        duration,
      });
      navigate("/admin/managepackages?action=add");
    } catch (err) {
      if (err.response?.status === 400) toast.warn(err.response.data.detail);
      else {
        console.error(err);
        if (!toast.isActive(1)) toast.error("Unexpected Error", { toastId: 1 });
      }
    }
  };

  return (
    <>
      <Header />
      <ToastContainer autoClose={2500} position="top-center" />
      <main className="fixed inset-0 top-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-slate-800/70 backdrop-blur-2xl rounded-2xl border border-slate-700 shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-white text-center shadow-md">
            <h2 className="text-2xl font-extrabold flex justify-center items-center gap-2 tracking-wide">
              <FaSuitcaseRolling className="w-5 h-5" />
              {action === "edit" ? "Edit Package" : "Add New Package"}
            </h2>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wider">
                Package Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Enter package name"
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900/50 text-gray-100 placeholder-gray-400 border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wider">
                Package Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["adventure", "honeymoon", "family"].map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => setType(pkg)}
                    className={`py-2 px-3 text-sm rounded-lg font-semibold uppercase tracking-wide transition-all duration-300 border ${
                      type === pkg
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-lg scale-[1.05]"
                        : "bg-slate-900/60 text-gray-300 border-slate-700 hover:border-cyan-400 hover:text-cyan-300"
                    }`}
                  >
                    {pkg}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wider">
                Location
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 w-3 h-3" />
                <input
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                  type="text"
                  placeholder="Enter location"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-slate-900/50 text-gray-100 placeholder-gray-400 border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wider">
                Duration (Days)
              </label>
              <div className="relative">
                <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 w-3 h-3" />
                <input
                  onChange={(e) => setDuration(e.target.value)}
                  value={duration}
                  type="number"
                  placeholder="Enter duration"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-slate-900/50 text-gray-100 placeholder-gray-400 border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Slots */}
            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wider">
                Available Slots
              </label>
              <div className="relative">
                <MdEventAvailable className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 w-4 h-4" />
                <input
                  onChange={(e) => setSlot(e.target.value)}
                  value={slot}
                  type="number"
                  placeholder="Enter slots"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-900/50 text-gray-100 placeholder-gray-400 border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wider">
                Price (₹)
              </label>
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 w-3 h-3" />
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  type="number"
                  placeholder="Enter price"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-slate-900/50 text-gray-100 placeholder-gray-400 border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={action === "edit" ? handleEdit : handleAdd}
                className="w-full py-3 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]"
              >
                {action === "edit" ? (
                  <>
                    <FaSave className="w-4 h-4" /> Save Changes
                  </>
                ) : (
                  <>
                    <FaPlus className="w-4 h-4" /> Add Package
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/admin/managepackages")}
                className="w-full py-2.5 text-sm font-semibold text-gray-300 rounded-lg bg-slate-700/50 hover:bg-slate-600/60 hover:text-white border border-slate-600 active:scale-[0.98] transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default EditAddPackage;
