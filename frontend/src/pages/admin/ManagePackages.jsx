import Header from "../../components/Header";
import AdminPackageCard from "../../components/AdminPackageCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Circles } from "react-loading-icons";
import { FaPlus, FaMapMarkedAlt } from "react-icons/fa";
import { MdCardTravel } from "react-icons/md";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  const getPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/packages/`);
      setPackages(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Delete Package "${name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
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
        await axios.delete(`${API_BASE}/packages/${id}`);
        setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
        toast.success(`Package "${name}" deleted successfully`);
      } catch (err) {
        if (err.response?.status === 409)
          toast.error(err.response.data.detail);
        else toast.error("Unexpected error while deleting");
        console.error(err);
      }
    }
  };

  const handleEdit = (pkg) => {
    navigate(
      `/admin/editaddpackage?for=edit&id=${pkg.id}&name=${pkg.name}&type=${pkg.type}&price=${pkg.price}&slot=${pkg.slot}&location=${pkg.location}&duration=${pkg.duration}`
    );
  };

  useEffect(() => {
    getPackages();
    if (action === "update") toast.success("Package updated successfully");
    else if (action === "add") toast.success("Package added successfully");
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <ToastContainer autoClose={2500} position="top-center" />

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-700 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                <MdCardTravel className="text-teal-600" />
                Manage Packages
              </h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                View, update, or delete travel packages efficiently.
              </p>
            </div>

            <Link
              to="/admin/editaddpackage?for=add"
              className="group flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:from-teal-700 hover:to-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
              Add Package
            </Link>
          </div>

          {/* Table Wrapper */}
          <div className="backdrop-blur-xl bg-white/80 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-100 to-gray-200 px-8 py-4 border-b border-gray-300">
              <div className="grid grid-cols-7 gap-4 text-center text-gray-700 font-semibold uppercase text-xs tracking-wider">
                <span>ID</span>
                <span>Name</span>
                <span>Type</span>
                <span>Location</span>
                <span>Price</span>
                <span>Slot</span>
                <span>Actions</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {packages.length === 0 ? (
                <div className="py-16">
                  {loading ? (
                    <Circles
                      stroke="#0d9488"
                      className="w-16 h-16 block mx-auto"
                    />
                  ) : (
                    <div className="text-center">
                      <FaMapMarkedAlt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600 text-lg font-medium">
                        No packages available
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Add a new package to get started.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="group bg-white/70 hover:bg-gradient-to-r from-teal-50 to-blue-50 border border-gray-200 hover:border-teal-400 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    <AdminPackageCard
                      id={pkg.id}
                      name={pkg.name}
                      type={pkg.type}
                      location={pkg.location}
                      price={pkg.price}
                      slot={pkg.slot}
                      duration={pkg.duration}
                      action={
                        <div className="flex flex-wrap gap-3 justify-center">
                          <button
                            onClick={() => handleEdit(pkg)}
                            className="px-5 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(pkg.id, pkg.name)}
                            className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                          >
                            Delete
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

      {/* Custom Scrollbar */}
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
};

export default ManagePackages;
