import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentRegister from './pages/StudentRegister';
import RegistrationSuccess from './pages/RegistrationSuccess';
import StudentDashboard from './pages/StudentDashboard';
import StudentsPage from './pages/admin/StudentsPage';
import StudentDetails from './pages/admin/StudentDetails';
import TeachersPage from './pages/admin/TeachersPage';
import CoursesPage from './pages/admin/CoursesPage';
import CamerasPage from './pages/admin/CamerasPage';
import AttendancePage from './pages/admin/AttendancePage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

const PrivateRoute = ({ children }) => {
  // ... same as before ...
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
};

import AdminDashboard from './pages/AdminDashboard';





import AdminLayout from './components/Layout/AdminLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register-student" element={<StudentRegister />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/:id" element={<StudentDetails />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/cameras" element={<CamerasPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/stats" element={<AnalyticsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            {/* Add future admin routes here */}
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
