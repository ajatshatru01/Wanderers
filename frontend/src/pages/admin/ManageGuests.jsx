import Header from "../../components/Header";
import UserCard from "../../components/UserCard";
import { FaUserFriends } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Circles } from "react-loading-icons";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function ManageGuests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all bookings
  const getBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/bookings/`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't Get Bookings");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle booking cancellation
  const handleCancel = async (id, pkgName) => {
    const result = await Swal.fire({
      title: `Cancel Booking for ${pkgName}?`,
      text: "This will remove the booking and restore available slots.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel Booking",
      cancelButtonText: "Go Back",
      background: "#f9fafb",
      color: "#1f2937",
      iconColor: "#10b981",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-200",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/bookings/${id}`);
        setBookings((prev) => prev.filter((b) => b.id !== id));
        toast.success(`Booking for ${pkgName} cancelled successfully`);
      } catch (err) {
        console.error(err);
        toast.error("Couldn't cancel booking");
      }
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <>
      <Header />
      <ToastContainer autoClose={2500} position="top-center" />

      <main className="min-h-screen py-10 bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-500 flex items-center justify-center gap-3 drop-shadow-sm">
              <FaUserFriends className="text-teal-500" />
              Manage Guest Bookings
            </h1>
            <p className="text-gray-600 mt-3 text-sm">
              View and manage all guest package reservations efficiently.
            </p>
          </div>

          {/* Data Container */}
          <div className="backdrop-blur-lg bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-3xl border border-gray-200 overflow-hidden">

            {/* Header Row */}
            <div className="bg-gradient-to-r from-indigo-100 via-gray-50 to-emerald-50 px-8 py-4 border-b border-gray-200">
              <UserCard
                user="Guest Name"
                packageName="Package"
                location="Location"
                dates="Booking Date"
                people="Guests"
                duration="Duration"
                className="text-gray-800 font-bold text-xs uppercase tracking-wider"
              />
            </div>

            {/* Scrollable Section */}
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {bookings.length === 0 ? (
                <div className="py-16">
                  {loading ? (
                    <Circles
                      stroke="#10b981"
                      className="w-16 h-16 block mx-auto"
                    />
                  ) : (
                    <div className="text-center">
                      <FaUserFriends className="w-14 h-14 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600 text-lg font-medium">
                        No active bookings
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Guest bookings will appear here
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="group relative bg-white/60 hover:bg-white/90 rounded-2xl border border-gray-200 hover:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-lg backdrop-blur-md p-4 flex flex-col gap-3"
                  >
                    <UserCard
                      user={booking.user_name}
                      packageName={booking.package_name}
                      location={booking.location}
                      dates={new Date(booking.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      people={booking.total_people}
                      duration={booking.duration + " days"}
                    />

                    {/* Cancel Button */}
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() =>
                          handleCancel(booking.id, booking.package_name)
                        }
                        className="group/btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white hover:shadow-md transition-all duration-300"
                      >
                        <MdLogout className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ManageGuests;
