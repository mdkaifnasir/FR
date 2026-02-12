import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentRegister from './pages/StudentRegister';
import RegistrationSuccess from './pages/RegistrationSuccess';
import FaceLogin from './pages/FaceLogin';

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

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-background-light font-display p-4 md:p-8 relative overflow-hidden">
      <div className="campus-pattern"></div>
      <div className="architectural-overlay"></div>
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl">face_unlock</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">EduGate Admin</h1>
              <p className="text-xs text-slate-500 font-bold mt-1.5 uppercase tracking-widest">Attendance Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">System Administrator</p>
            </div>
            <button onClick={logout} className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100">
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
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span> Enrollment Quick Links
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 font-medium">Enroll new students into the biometric attendance system through the secure registration portal.</p>
            <Link to="/register-student" className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group">
              Open Registration Portal <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">settings</span> System Controls
              </h3>
            </div>
            <div className="space-y-4">
              <button className="flex items-center gap-4 w-full p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors text-left group">
                <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">Attendance Reports</p>
                  <p className="text-[11px] text-slate-500 font-medium">Generate daily/monthly summaries</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white transition-all hover:translate-y-[-2px] hover:shadow-xl">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600`}><span className="material-symbols-outlined">{icon}</span></div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">Live</span>
    </div>
    <h4 className="text-2xl font-black text-slate-900 mb-1">{value}</h4>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{title}</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login-face" element={<FaceLogin />} />
          <Route path="/register-student" element={<StudentRegister />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
