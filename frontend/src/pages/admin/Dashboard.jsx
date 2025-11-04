import { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";
import {
  BarChart,
  CartesianGrid,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  FaChartPie,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaSuitcaseRolling,
} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASEURL;

function Dashboard() {
  const [availability, setAvailability] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [monthCount, setMonthCount] = useState(0);
  const [currentGraph, setCurrentGraph] = useState("availability");
  const [error, setError] = useState(false);

  const currentDate = new Date();
  const formattedMonth = currentDate.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    if (error) {
      if (!toast.isActive(1)) toast.error("Unexpected Error", { toastId: 1 });
    }
  }, [error]);

  const fetchAvailability = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dashboard/availability`);
      setAvailability(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dashboard/revenue`);
      setMonthlyRevenue(res.data);
      const total = res.data.reduce((sum, item) => sum + item.revenue, 0);
      setTotalRevenue(total);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const fetchMonthlyBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dashboard/bookings/monthly`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchAvailability();
    fetchRevenue();
    fetchMonthlyBookings();
  }, []);

  useEffect(() => {
    if (bookings.length) {
      const monthData = bookings.find((b) => b.period === formattedMonth);
      setMonthCount(monthData ? monthData.count : 0);
    }
  }, [bookings, formattedMonth]);

  // 📊 Radial Chart for Availability
  const showAvailability = () => {
    const percent = availability?.occupancy_percentage || 0;
    const data = [
      { name: "Occupancy", value: percent, fill: "#06b6d4" },
      { name: "Remaining", value: 100 - percent, fill: "#334155" },
    ];
    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={15}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            minAngle={15}
            clockWise
            dataKey="value"
            cornerRadius={10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30,41,59,0.9)",
              border: "1px solid #06b6d4",
              color: "white",
              borderRadius: "10px",
            }}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xl font-semibold fill-cyan-400"
          >
            {percent}%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

  const showRevenue = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="month" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
        <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(30,41,59,0.9)",
            border: "1px solid #38bdf8",
            color: "#e2e8f0",
            borderRadius: "10px",
          }}
        />
        <Bar dataKey="revenue" fill="url(#revenueGrad)" radius={[10, 10, 0, 0]} />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );

  const showBookings = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={bookings} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="period" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
        <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(30,41,59,0.9)",
            border: "1px solid #3b82f6",
            color: "#f9fafb",
            borderRadius: "10px",
          }}
        />
        <Bar dataKey="count" fill="url(#bookGrad)" radius={[10, 10, 0, 0]} />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-900 py-10 text-white">
        <ToastContainer autoClose={2500} position="top-center" />
        <div className="max-w-7xl mx-auto px-8">
          {/* Title Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold inline-flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              <MdTrendingUp className="text-cyan-400" />
              Travel Agency Dashboard
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Real-time insights on bookings, revenue, and occupancy
            </p>
          </div>

          {/* Summary Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                key: "availability",
                title: "Package Occupancy",
                icon: <FaSuitcaseRolling className="w-6 h-6" />,
                color: "from-cyan-500 to-blue-500",
                value: availability
                  ? `${availability.occupancy_percentage}%`
                  : "Loading...",
              },
              {
                key: "revenue",
                title: "Total Revenue",
                icon: <FaMoneyBillWave className="w-6 h-6" />,
                color: "from-emerald-400 to-teal-500",
                value: `₹${totalRevenue.toLocaleString()}`,
              },
              {
                key: "bookings",
                title: `Bookings (${formattedMonth})`,
                icon: <FaCalendarCheck className="w-6 h-6" />,
                color: "from-indigo-400 to-sky-500",
                value: monthCount,
              },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => setCurrentGraph(item.key)}
                className={`cursor-pointer transition-all duration-500 rounded-2xl p-6 border border-slate-700 backdrop-blur-md text-center
                ${
                  currentGraph === item.key
                    ? `bg-gradient-to-br ${item.color} text-white shadow-[0_0_25px_rgba(56,189,248,0.6)] scale-105`
                    : "bg-slate-800/60 text-gray-300 hover:scale-105 hover:bg-slate-800/80"
                }`}
              >
                <div className="flex justify-center mb-3">
                  <div
                    className={`p-3 rounded-full ${
                      currentGraph === item.key ? "bg-white/20" : "bg-slate-700/50"
                    }`}
                  >
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-3xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 justify-center text-cyan-300">
              {currentGraph === "availability" && (
                <>
                  <FaChartPie /> Package Availability Overview
                </>
              )}
              {currentGraph === "revenue" && (
                <>
                  <FaMoneyBillWave /> Monthly Revenue Breakdown
                </>
              )}
              {currentGraph === "bookings" && (
                <>
                  <FaCalendarCheck /> Monthly Bookings Trend
                </>
              )}
            </h2>

            <div className="flex justify-center items-center">
              {currentGraph === "availability" && showAvailability()}
              {currentGraph === "revenue" && showRevenue()}
              {currentGraph === "bookings" && showBookings()}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
