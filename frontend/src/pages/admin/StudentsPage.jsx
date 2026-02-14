import React, { useState, useEffect } from 'react';
import StudentTable from '../../components/Admin/StudentTable';
import StudentFormModal from '../../components/Admin/StudentFormModal';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(students.filter(student => student.id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student');
        }
    };

    const handleSave = (savedStudent) => {
        if (selectedStudent) {
            setStudents(students.map(s => s.id === savedStudent.id ? savedStudent : s));
        } else {
            setStudents([...students, savedStudent]);
        }
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedStudent(null);
        setIsModalOpen(true);
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Search students by name, ID, or email..."
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
                    Add New Student
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <StudentTable
                    students={filteredStudents}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}

            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                student={selectedStudent}
            />
        </div>
    );
};

export default StudentsPage;
