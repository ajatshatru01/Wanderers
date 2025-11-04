import Header from "../../components/Header";
import { useState, useEffect } from "react";
import PackageCard from "../../components/Packagecard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Circles } from "react-loading-icons";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function SearchResults() {
  const [packages, setPackages] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [packageType, setPackageType] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/packages/available?price=${maxPrice}`;

      if (packageType && packageType !== "All") url += `&type=${packageType}`;
      if (location.trim() !== "") url += `&location=${encodeURIComponent(location)}`;

      const res = await axios.get(url);
      setPackages(res.data);
    } catch (err) {
      console.error(err);
      if (!toast.isActive(1))
        toast.error("Couldn't get travel packages, please try again", { toastId: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
  }, []);

  return (
    <>
      <Header />
      <div
        className={`flex flex-col items-center w-full ${
          packages.length > 6 ? "h-auto" : "min-h-screen"
        } py-10 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100`}
      >
        <ToastContainer position="top-center" autoClose={2500} />

        {/* ===== FILTER BAR ===== */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-8 mx-4 lg:mx-auto max-w-7xl flex flex-wrap justify-between items-center gap-8 transition-all hover:shadow-2xl">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            Filters
          </h2>

          {/* Location Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Search destination..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-cyan-300 outline-none w-56 bg-white/90 shadow-inner"
            />
          </div>

          {/* Price Filter */}
          <div className="flex flex-col gap-2 min-w-[220px]">
            <label className="text-sm font-semibold text-gray-700">
              Max Price:{" "}
              <span className="text-teal-600 font-bold">₹{maxPrice}</span>
            </label>
            <input
              type="range"
              max="100000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="cursor-pointer w-full h-2 bg-gradient-to-r from-cyan-300 to-teal-400 rounded-full appearance-none accent-teal-600 hover:scale-[1.02] transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-3 items-center flex-wrap">
            <p className="text-sm font-semibold text-gray-700">Type</p>
            {["Adventure", "Honeymoon", "Family", "All"].map((type, idx) => (
              <label key={idx} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  className="peer sr-only"
                  checked={
                    packageType === type ||
                    (type === "All" && packageType === null)
                  }
                  onChange={(e) =>
                    setPackageType(
                      e.target.value === "All" ? null : e.target.value
                    )
                  }
                />
                <div className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white/70 shadow-sm transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-cyan-600 peer-checked:to-teal-600 peer-checked:text-white peer-checked:shadow-lg peer-checked:scale-105 hover:border-cyan-400">
                  {type}
                </div>
              </label>
            ))}
          </div>

          {/* Apply Button */}
          <button
            onClick={handleFilter}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold shadow-md hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg active:scale-95 transition-all duration-300"
          >
            Apply Filters
          </button>
        </div>

        {/* ===== RESULTS ===== */}
        <div className="mt-10 w-4/5 max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Circles stroke="#0D9488" className="w-16 h-16" />
            </div>
          ) : packages.length === 0 ? (
            <p className="text-gray-600 text-lg text-center font-medium mt-10">
              No travel packages match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  name={pkg.name}
                  type={pkg.type}
                  price={pkg.price}
                  location={pkg.location}
                  duration={pkg.duration}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchResults;
