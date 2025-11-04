function AdminPackageCard({
  id,
  name,
  type,
  location,
  price,
  slot,
  duration,
  action,
  className = '',
}) {
  const formattedType = type ? type.charAt(0).toUpperCase() + type.slice(1) : '—';
  const formattedLocation = location ? location.charAt(0).toUpperCase() + location.slice(1) : '—';
  const isAvailable = slot > 0;

  const statusColor = isAvailable
    ? "bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-md"
    : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md";

  const statusText = isAvailable ? "Available" : "Full";

  return (
    <div
      className={`relative flex flex-col bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ${className}`}
    >
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>

      {/* Main Grid */}
      <div className="grid grid-cols-7 gap-6 items-center text-center mt-3">
        {/* ID */}
        <div className="text-gray-500 font-semibold tracking-wide">#{id}</div>

        {/* Package Name */}
        <div className="font-extrabold text-gray-900 text-xl tracking-tight">{name}</div>

        {/* Type */}
        <div className="text-indigo-600 font-medium">{formattedType}</div>

        {/* Location */}
        <div className="text-gray-700 font-medium">{formattedLocation}</div>

        {/* Price */}
        <div className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          ₹{price}
        </div>

        {/* Slot / Status */}
        <div>
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${statusColor} transition-all duration-300`}
          >
            <span className="w-2 h-2 bg-white rounded-full shadow-sm"></span>
            {statusText} ({slot})
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-center">{action}</div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-sm text-gray-600 border-t border-gray-200 pt-3">
        <span className="font-medium">
          ⏳ Duration: <span className="text-gray-800 font-semibold">{duration} days</span>
        </span>
        <span className="italic text-gray-400">Package ID: #{id}</span>
      </div>
    </div>
  );
}

export default AdminPackageCard;
