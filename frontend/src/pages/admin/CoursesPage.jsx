import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseFormModal from '../../components/Admin/CourseFormModal';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/courses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(courses.filter(course => course.id !== id));
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course');
        }
    };

    const handleSave = (savedCourse) => {
        fetchCourses(); // Refetch to get updated relations (e.g. teacher name)
        // Alternatively, we could update the state manually if we respond with relation data from backend
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedCourse(null);
        setIsModalOpen(true);
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.teacher && course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="pl-10 pr-4 py-3 bg-white rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 w-full shadow-sm border border-slate-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New Course
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={() => handleEdit(course)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500">
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button onClick={() => handleDelete(course.id)} className="p-2 bg-rose-50 rounded-full hover:bg-rose-100 text-rose-500">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <span className="material-symbols-outlined text-2xl">book_2</span>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                    {course.code}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 mb-1">{course.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{course.department || 'General'} • Sem {course.semester || '-'}</p>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                    {course.teacher?.name?.substring(0, 2) || 'T'}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-700">{course.teacher?.name || 'No Teacher Assigned'}</p>
                                    <p className="text-[10px] text-slate-400">Instructor</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredCourses.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                            No courses found.
                        </div>
                    )}
                </div>
            )}

            <CourseFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                course={selectedCourse}
            />
        </div>
    );
};

export default CoursesPage;
