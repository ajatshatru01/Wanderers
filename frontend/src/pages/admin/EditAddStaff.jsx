import Header from "../../components/Header";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaUserTie, FaSave, FaPlus, FaPhone, FaBriefcase, FaIdCard } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function EditAddStaff() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get("for");
  const staff_name = searchParams.get("name");
  const staff_role = searchParams.get("role");
  const staff_phone = searchParams.get("phone");
  const id = searchParams.get("id");

  const [name, setName] = useState(staff_name || "");
  const [role, setRole] = useState(staff_role || "");
  const [phone, setPhone] = useState(staff_phone || "");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleAdd = async () => {
    if (!name || !role || !phone) {
      toast.error("Please Fill All Fields!");
      return;
    }

    try {
      await axios.post(`${API_BASE}/staff/`, { name, role, phone });
      navigate("/admin/managestaff?action=add");
    } catch (err) {
      if (err.response?.status === 400) toast.warn(err.response.data.detail);
      else toast.error("Unexpected Error");
    }
  };

  const handleEdit = async (id) => {
    if (!name || !role || !phone) {
      toast.error("Please Fill All Fields!");
      return;
    }

    try {
      await axios.put(`${API_BASE}/staff/${id}`, { name, role, phone });
      navigate("/admin/managestaff?action=update");
    } catch (err) {
      if (err.response?.status === 400) toast.warn(err.response.data.detail);
      else toast.error("Unexpected Error");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer autoClose={2500} position="top-center" />
      <main className="fixed inset-0 top-20 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-teal-100 px-4">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-lg rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden relative">
          
          {/* Decorative glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 opacity-25 blur-3xl -z-10" />

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-500 text-white text-center py-5 shadow-inner">
            <h2 className="text-2xl font-extrabold tracking-wide flex items-center justify-center gap-3">
              <FaUserTie className="w-5 h-5" />
              {action === "edit" ? "Edit Staff Member" : "Add New Staff"}
            </h2>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            
            {/* Name */}
            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 mb-1 tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter full name"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/70 backdrop-blur-sm transition-all"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 mb-1 tracking-wide">
                Role
              </label>
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4" />
                <input
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                  type="text"
                  placeholder="e.g., Travel Guide, Agent, Manager"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/70 backdrop-blur-sm transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 mb-1 tracking-wide">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 w-3.5 h-3.5" />
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/70 backdrop-blur-sm transition-all"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => (action === "edit" ? handleEdit(id) : handleAdd())}
                className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-all flex items-center justify-center gap-2"
              >
                {action === "edit" ? (
                  <>
                    <FaSave className="w-4 h-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <FaPlus className="w-4 h-4" />
                    Add Staff
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/admin/managestaff")}
                className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
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

export default EditAddStaff;
