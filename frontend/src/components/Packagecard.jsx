import { Link } from "react-router-dom";
import adventureImg from "../assets/adventure.jpg";
import honeymoonImg from "../assets/honeymoon.jpg";
import familyImg from "../assets/family.jpg";
import beachimg from "../assets/beach.jpg";
function PackageCard({ id, name, type, price, location, duration }) {
  const handleTypeImage = () => {
    if (type === "adventure") return adventureImg;
    else if (type === "honeymoon") return honeymoonImg;
    else if (type==="Beach") return beachimg;
    else return familyImg;
  };

  return (
    <div className="group relative bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-600 text-white p-5 rounded-3xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
      
      {/* Card Background Glow */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl -z-10"></div>

      <div className="flex gap-5 items-center">
        {/* Left Section — Text */}
        <div className="flex-1">
          <h2 className="font-extrabold text-2xl text-white tracking-tight drop-shadow-md group-hover:text-cyan-300 transition-colors duration-300">
            {name}
          </h2>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-300/40 text-xs font-semibold backdrop-blur-sm">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>

            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/40 text-xs font-semibold backdrop-blur-sm">
              {location}
            </span>
          </div>

          {/* Duration */}
          <p className="mt-3 text-sm text-gray-200">
            Duration: <span className="font-semibold text-white">{duration} days</span>
          </p>

          {/* Price */}
          <h3 className="mt-3 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500">
            ₹{price}
            <span className="text-gray-300 text-sm font-medium opacity-80">
              {" "}/person
            </span>
          </h3>
        </div>

        {/* Right Section — Image */}
        <div className="relative overflow-hidden rounded-2xl w-44 h-28 shadow-md">
          <img
            src={handleTypeImage()}
            alt={`${type} package`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
        </div>
      </div>

      {/* Book Now Button */}
      <div className="mt-5 flex justify-end">
        <Link
          to={`/guest/bookingconfirm?package_id=${id}&package_name=${name}&package_type=${type}&package_price=${price}&package_location=${location}&package_duration=${duration}`}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 text-white font-semibold tracking-wide shadow-md hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:scale-105 transition-all duration-300"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}

export default PackageCard;
