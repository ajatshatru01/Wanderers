import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './auth/Authorization';

import Home, { UserHome } from './pages/user/Home';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import SearchResults from './pages/user/SearchResults';
import BookingConfirm from './pages/user/BookingConfirm';
import SearchContextFunc from './pages/user/SearchContext';
import ManageGuests from './pages/admin/ManageGuests';
import ManageStaff from './pages/admin/ManageStaff';
import EditAddPackage from './pages/admin/EditAddPackage';
import ManagePackages from './pages/admin/ManagePackages';
import EditAddStaff from './pages/admin/EditAddStaff';

// --------------------
// Protected Route Wrapper
// --------------------
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && user.role === "guest") return <Navigate to="/guest/home" replace />;
  if (!adminOnly && user.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return children;
}

// --------------------
// App Component
// --------------------
function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Guest Routes */}
      <Route
        path="/guest"
        element={
          <ProtectedRoute>
            <SearchContextFunc>
              <Outlet />
            </SearchContextFunc>
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="booked" element={<UserHome />} /> {/* ✅ Fixed: moved inside /guest */}
        <Route path="searchresults" element={<SearchResults />} />
        <Route path="bookingconfirm" element={<BookingConfirm />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="manageguests" element={<ManageGuests />} />
        <Route path="managepackages" element={<ManagePackages />} />
        <Route path="managestaff" element={<ManageStaff />} />
        <Route path="editaddpackage" element={<EditAddPackage />} />
        <Route path="editaddstaff" element={<EditAddStaff />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
