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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome, {user?.name} ({user?.role})!</p>
        <div className="mt-6 flex space-x-4">
          <a href="/register-student" className="bg-blue-600 text-white px-4 py-2 rounded">Register New Student</a>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>
    </div>
  )
}

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
