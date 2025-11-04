import { FaUsers } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPlaneDeparture } from "react-icons/fa";

function UserCard({ user, packageName, location, dates, people, duration, className }) {
  return (
    <div
      className={`relative grid grid-cols-6 gap-6 items-center text-center px-8 py-5 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 text-white shadow-lg hover:shadow-2xl hover:scale-[1.01] border border-white/20 backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Soft glow layer */}
      <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl opacity-20 -z-10"></div>

      {/* User */}
      <div className="font-bold text-lg tracking-wide text-cyan-200 drop-shadow-sm">
        {user}
      </div>

      {/* Package */}
      <div className="font-extrabold text-lg text-white flex flex-col items-center">
        <span className="tracking-tight">{packageName}</span>
        <div className="text-xs text-gray-200 flex items-center justify-center gap-1 mt-1">
          <FaMapMarkerAlt className="text-amber-300" />
          <span className="italic">{location}</span>
        </div>
      </div>

      {/* Travel Dates */}
      <div className="text-sm text-gray-100 flex items-center justify-center gap-2 font-medium">
        <FaPlaneDeparture className="text-sky-300" />
        {dates}
      </div>

      {/* People */}
      <div className="flex items-center justify-center gap-2 font-semibold text-fuchsia-200">
        <FaUsers className="w-4 h-4 text-fuchsia-300" />
        {people}
      </div>

      {/* Duration */}
      <div className="text-sm font-medium text-cyan-100">
        {duration}
      </div>

      {/* Status / Checkout */}
      <div className="text-sm font-semibold text-emerald-300 bg-emerald-400/20 border border-emerald-300/30 px-4 py-1 rounded-full shadow-inner">
        Confirmed
      </div>
    </div>
  );
}

export default UserCard;

