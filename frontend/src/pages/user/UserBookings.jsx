import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../auth/Authorization";
import { FaMapMarkerAlt, FaUsers, FaRupeeSign, FaTrashAlt, FaClock } from "react-icons/fa";
import { Circles } from "react-loading-icons";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function UserBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user?.id) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/bookings/user/${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (booking_id) => {
    const confirm = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE}/bookings/${booking_id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
        fetchBookings();
      } catch (err) {
        Swal.fire("Error", "Failed to cancel booking. Try again later.", "error");
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Circles stroke="#0D9488" />
      </div>
    );

  if (!bookings.length)
    return (
      <div className="text-center text-gray-500 py-10 text-lg">
        You haven’t booked any packages yet.
      </div>
    );

  return (
    <div className="mt-20 px-6 sm:px-10 space-y-8">
      {bookings.map((b) => (
        <div
          key={b.booking_id}
          className="relative bg-white/60 backdrop-blur-xl border border-white/30 rounded-3xl shadow-md hover:shadow-xl hover:shadow-teal-100 transition-all duration-500 overflow-hidden"
        >
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-4 text-white rounded-t-3xl flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{b.package_name}</h3>
              <p className="text-xs text-cyan-100 tracking-wide capitalize">
                {b.package_type}
              </p>
            </div>
            <p className="flex items-center gap-1 text-lg font-semibold">
              <FaRupeeSign className="w-4 h-4" />
              {b.package_price?.toLocaleString()}
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-gray-700 text-sm">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-cyan-600" />
                <span>{b.package_location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-teal-600" />
                <span>
                  {b.total_people}{" "}
                  {b.total_people === 1 ? "person" : "people"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-blue-600" />
                <span>{b.package_duration} days</span>
              </div>
            </div>

            <button
              onClick={() => handleCancel(b.booking_id)}
              className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl transition-all duration-300"
            >
              <FaTrashAlt /> Cancel Booking
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserBookings;
