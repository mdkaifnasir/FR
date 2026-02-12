import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid Student ID or password');
        }
    };

    return (
        <div className="font-display bg-background-light min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="campus-pattern"></div>
            <div className="architectural-overlay"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-xl shadow-primary/30 group">
                        <span className="material-symbols-outlined text-white text-4xl group-hover:scale-110 transition-transform">face_unlock</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">EduGate</h1>
                    <p className="text-slate-500 mt-1 font-medium">Student Attendance & Registration System</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-white transition-all hover:shadow-primary/5">
                    <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">login</span>
                        Student Login
                    </h2>

                    {error && (
                        <div className="p-4 mb-8 text-sm text-red-700 bg-red-50 border border-red-100 rounded-2xl flex items-center animate-shake">
                            <span className="material-symbols-outlined text-base mr-3">error_outline</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ID Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="student-id">
                                Student ID / Roll Number
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-lg group-focus-within:text-primary transition-colors">badge</span>
                                </div>
                                <input
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    id="student-id"
                                    name="student-id"
                                    placeholder="e.g. STU-12345"
                                    required
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="password">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-lg group-focus-within:text-primary transition-colors">lock</span>
                                </div>
                                <input
                                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                                </button>
                            </div>
                        </div>

                        {/* Options Row */}
                        <div className="flex items-center justify-between text-sm px-1">
                            <div className="flex items-center">
                                <input className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded-md cursor-pointer transition-all" id="remember-me" name="remember-me" type="checkbox" />
                                <label className="ml-2.5 block text-slate-600 cursor-pointer font-medium" htmlFor="remember-me">
                                    Remember me
                                </label>
                            </div>
                            <a className="font-bold text-primary hover:text-primary/80 transition-colors" href="#">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-md font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all group active:scale-95 shadow-primary/20" type="submit">
                            Login to Dashboard
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-100"></div>
                            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
                            <div className="flex-grow border-t border-slate-100"></div>
                        </div>

                        {/* Face ID Login Button */}
                        <Link to="/login-face" className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-slate-100 rounded-2xl text-md font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all group active:scale-95 shadow-sm">
                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">face_unlock</span>
                            Sign in with Face ID
                        </Link>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-500">
                            Not registered yet?
                            <Link to="/register-student" className="ml-1.5 font-bold text-primary hover:text-primary/80 transition-colors">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Branding */}
                <div className="mt-8 text-center flex items-center justify-center gap-1.5 text-slate-400">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <p className="text-[10px] uppercase font-bold tracking-widest">Secure Institutional Access</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
