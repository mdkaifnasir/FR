import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="text-blue-600 text-2xl">🎓</div>
                <span className="text-xl font-bold text-gray-800">CollegeFace | Student Portal</span>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:text-gray-700">🔔</button>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">Admin Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
