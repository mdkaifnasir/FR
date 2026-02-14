import React from 'react';
import { Link } from 'react-router-dom';

const StudentTable = ({ students, onDelete, onEdit }) => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-slate-400 border-b border-slate-50 uppercase tracking-widest font-black">
                            <th className="pb-4 pl-4 font-black">Name</th>
                            <th className="pb-4 font-black">Details</th>
                            <th className="pb-4 font-black">Course</th>
                            <th className="pb-4 font-black">Contact</th>
                            <th className="pb-4 font-black">Face Status</th>
                            <th className="pb-4 font-black text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-600">
                        {students.map(student => (
                            <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                <td className="py-4 pl-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase overflow-hidden">
                                            {/* Placeholder for student image if available, else initials */}
                                            {student.face_descriptor ? (
                                                <span className="material-symbols-outlined text-lg text-emerald-500">face</span>
                                            ) : (
                                                student.name.substring(0, 2)
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{student.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{student.student_id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="text-xs">
                                        <span className="block font-bold text-slate-700">{student.college}</span>
                                        <span className="text-slate-400">{student.department}</span>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="text-xs">
                                        <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 font-bold">{student.course}</span>
                                        <span className="ml-2 text-slate-400">Sem {student.semester}</span>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="text-xs text-slate-500 space-y-0.5">
                                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">mail</span> {student.email}</div>
                                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">call</span> {student.mobile}</div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    {student.face_descriptor ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wide border border-emerald-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Registered
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wide border border-amber-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 text-right pr-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link to={`/students/${student.id}`} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors" title="View Details">
                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                        </Link>
                                        <button
                                            onClick={() => onEdit && onEdit(student)}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button
                                            onClick={() => onDelete(student.id)}
                                            className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentTable;
