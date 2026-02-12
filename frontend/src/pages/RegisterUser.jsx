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
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
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

            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="campus-pattern"></div>
            <div className="architectural-overlay"></div>

            {/* Decorative background image */}
            <div className="absolute inset-0 z-[-2] overflow-hidden pointer-events-none opacity-10">
                <img
                    alt="University background"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC_ZEBXj0dmwSwhr-XQQEHeWSDnbpXFOF6oQj7lyDcU0466oBMxo0d-jEh2rNvisUpVTEmLlaaIXHpydYbEeUERZwG1JwAVtwVIvfnym6VrGNEtAq_O5_vXKWhdsA1LUAqGT1hIALpdu1vZbNckiLfWAnRaXrpJv6jheoFP6D60-9KPqWp49JaN8Ypx02Q_BKnNeUT6nEzatzpJWIKYQaoK_gKeLiHNX9VdCheORNv4-1A-AN_SWftFHauyMEEla4E2rXRu-78i34"
                />
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-4 shadow-lg shadow-primary/20">
                        <span className="material-icons text-white text-3xl">how_to_reg</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Join Academic Portal</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Staff & Faculty Registration</p>
                </div>

                <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl p-8 border border-slate-200/50 dark:border-slate-800">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Create Account</h2>

                    {error && (
                        <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                            <span className="material-icons text-sm mr-2">error_outline</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons text-slate-400 text-sm">person</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons text-slate-400 text-sm">mail</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    type="email"
                                    placeholder="john@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons text-slate-400 text-sm">work</span>
                                </div>
                                <select
                                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons text-slate-400 text-sm">lock</span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons text-slate-400 text-sm">lock_reset</span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                    />
                                    <button
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-icons text-sm">{showPassword ? "visibility_off" : "visibility"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all" type="submit">
                            Register Account
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?
                            <Link to="/login" className="ml-1 font-semibold text-primary hover:text-primary/80 transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterUser;
