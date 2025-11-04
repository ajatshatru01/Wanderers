import { useEffect, useState } from "react";
import Header from "../../components/Header";
import StaffCard from "../../components/StaffCard";
import axios from "axios";
import { Circles } from "react-loading-icons";
import { ToastContainer, toast } from "react-toastify";
import { Link, useSearchParams } from "react-router-dom";
import { FaUserTie, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  const getStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/staff/`);
      setStaff(res.data);
    } catch (err) {
      console.error(err);
      if (!toast.isActive(1))
        toast.error("Couldn't fetch staff list", { toastId: 1 });
    } finally {
      setLoading(false);
    }
  };

  const handleFire = async (id, name) => {
    const result = await Swal.fire({
      title: `Remove ${name}?`,
      text: "This will permanently delete this staff member from the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      color: "#374151",
      iconColor: "#f59e0b",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-200",
        title: "text-2xl font-bold text-gray-800",
        htmlContainer: "text-gray-600",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/staff/${id}`);
        setStaff((prev) => prev.filter((item) => item.id !== id));
        toast.success(`${name} removed successfully.`);
      } catch (err) {
        console.error(err);
        toast.error("Couldn't remove staff member.");
      }
    }
  };

  useEffect(() => {
    getStaff();
    if (action === "update") toast.success("Staff updated successfully!");
    else if (action === "add") toast.success("Staff added successfully!");
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <ToastContainer autoClose={2500} position="top-center" />

          {/* Header Section */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-700 to-blue-600 bg-clip-text text-transparent flex items-center gap-3 drop-shadow-sm">
                <FaUserTie className="text-teal-600" />
                Manage Travel Agency Staff
              </h1>
              <p className="text-gray-500 mt-2">
                View, edit, and manage your staff members with ease.
              </p>
            </div>
            <Link
              to="/admin/editaddstaff?for=add"
              className="group flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl hover:from-teal-700 hover:to-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
              Add Staff
            </Link>
          </div>

          {/* Staff Table Section */}
          <div className="backdrop-blur-md bg-white/80 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-8 py-4 border-b border-gray-300">
              <StaffCard
                name="Name"
                role="Role"
                phone="Phone"
                action="Actions"
                className="text-gray-700 font-semibold text-xs uppercase tracking-wider"
              />
            </div>

            {/* Table Content */}
            <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
              {staff.length === 0 ? (
                <div className="py-16">
                  {loading ? (
                    <Circles
                      stroke="#0d9488"
                      className="w-16 h-16 block mx-auto"
                    />
                  ) : (
                    <div className="text-center">
                      <FaUserTie className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600 text-lg font-medium">
                        No staff members found
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Add new staff to get started
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                staff.map((employee) => (
                  <div
                    key={employee.id}
                    className="group bg-white/70 hover:bg-gradient-to-r from-teal-50 to-blue-50 border border-gray-200 hover:border-teal-400 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <StaffCard
                      name={employee.name}
                      role={employee.role}
                      phone={employee.phone}
                      action={
                        <div className="flex gap-3 justify-center">
                          <Link
                            to={`/admin/editaddstaff?for=edit&id=${employee.id}&name=${employee.name}&role=${employee.role}&phone=${employee.phone}`}
                            className="px-5 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleFire(employee.id, employee.name)
                            }
                            className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                          >
                            Remove
                          </button>
                        </div>
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0d9488;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0f766e;
        }
      `}</style>
    </>
  );
}

export default ManageStaff;
