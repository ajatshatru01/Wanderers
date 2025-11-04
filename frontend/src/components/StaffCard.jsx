function StaffCard({ name, role, phone, action, className = '' }) {
  return (
    <div
      className={`relative grid grid-cols-4 gap-6 items-center text-center py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 text-white shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-white/20 backdrop-blur-lg ${className}`}
    >
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-20 -z-10"></div>

      {/* Name */}
      <div className="font-extrabold text-lg tracking-wide text-cyan-200 drop-shadow-sm">
        {name}
      </div>

      {/* Role */}
      <div className="font-semibold capitalize text-fuchsia-200">
        {role}
      </div>

      {/* Phone */}
      <div className="font-medium text-sm text-gray-200">
        {phone}
      </div>

      {/* Action */}
      <div className="flex justify-center">{action}</div>
    </div>
  );
}

export default StaffCard;
