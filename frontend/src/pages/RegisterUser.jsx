import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('teacher'); // Default to teacher
    const [error, setError] = useState('');
    const { login } = useAuth(); // We can use login after reg if we want, or just redirect
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirmation) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                role
            });

            // Auto login or redirect to login
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Sign Up (Teacher/Admin)</h2>
                {error && <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                        <input type="email" className="w-full px-3 py-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                        <input type="password" className="w-full px-3 py-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type="password" className="w-full px-3 py-2 border rounded" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                        <select className="w-full px-3 py-2 border rounded" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700">
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-blue-600 hover:underline">Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterUser;
