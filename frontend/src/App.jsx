import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentRegister from './pages/StudentRegister';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="campus-pattern"></div>
      <div className="architectural-overlay"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl">face_unlock</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">EduGate Admin</h1>
              <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Attendance Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">System Administrator</p>
            </div>
            <button onClick={logout} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:text-red-500 transition-colors border border-slate-200/50 dark:border-slate-700">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Students" value="1,284" icon="groups" color="primary" />
          <StatsCard title="Present Today" value="942" icon="done_all" color="emerald" />
          <StatsCard title="Pending Review" value="12" icon="pending_actions" color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Enrollment Quick Links
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Enroll new students into the biometric attendance system through the secure registration portal.</p>
            <Link to="/register-student" className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group">
              Open Registration Portal
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">settings</span>
                System Controls
              </h3>
            </div>
            <div className="space-y-4">
              <button className="flex items-center gap-4 w-full p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Attendance Reports</p>
                  <p className="text-[11px] text-slate-500">Generate daily/monthly summaries</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
              </button>
              <button className="flex items-center gap-4 w-full p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Access Logs</p>
                  <p className="text-[11px] text-slate-500">Monitor system entry points</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 transition-all hover:translate-y-[-2px]">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live</span>
    </div>
    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{value}</h4>
    <p className="text-xs font-medium text-slate-500">{title}</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
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
