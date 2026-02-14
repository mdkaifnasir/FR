import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/audit-logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800">Security Audit Logs</h1>
                <p className="text-slate-500 text-sm">Track system activities and security events.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 border-b border-slate-50 uppercase tracking-widest font-black bg-slate-50/50">
                                    <th className="py-4 pl-6 font-black">User</th>
                                    <th className="py-4 font-black">Action</th>
                                    <th className="py-4 font-black">Details</th>
                                    <th className="py-4 font-black">IP Address</th>
                                    <th className="py-4 pr-6 font-black text-right">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-slate-600">
                                {logs.map(log => (
                                    <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                        <td className="py-4 pl-6">
                                            <div className="font-bold text-slate-800">{log.user?.name || 'System / Unknown'}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{log.user?.email}</div>
                                        </td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase tracking-wide">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-slate-500 max-w-xs truncate block" title={JSON.stringify(log.details)}>
                                                {log.details ? JSON.stringify(log.details).substring(0, 50) + (JSON.stringify(log.details).length > 50 ? '...' : '') : '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 font-mono text-xs text-slate-500">
                                            {log.ip_address || '-'}
                                        </td>
                                        <td className="py-4 pr-6 text-right">
                                            <div className="text-slate-700">{new Date(log.created_at).toLocaleDateString()}</div>
                                            <div className="text-xs text-slate-400">{new Date(log.created_at).toLocaleTimeString()}</div>
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                                            No audit logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogsPage;
