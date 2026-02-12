import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import StudentRegister from './pages/StudentRegister';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <span className="material-icons text-3xl">dashboard</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Registration</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Enroll new students into the attendance system.</p>
            <Link to="/register-student" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <span className="material-icons text-sm mr-2">person_add</span> Register New Student
            </Link>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Account</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Manage your profile and security settings.</p>
            <button onClick={logout} className="inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <span className="material-icons text-sm mr-2">logout</span> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<RegisterUser />} />
          <Route path="/register-student" element={<StudentRegister />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
