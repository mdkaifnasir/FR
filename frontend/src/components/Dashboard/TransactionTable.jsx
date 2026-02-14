import React from 'react';

const TransactionTable = () => {
    const transactions = [
        { id: 1, name: 'Emma Ryan Jr.', type: 'Salary', status: 'Pending', date: 'Feb 19th, 2023', amount: '3,892', avatar: '' },
        { id: 2, name: 'Adrian Daren', type: 'Bonus', status: 'Done', date: 'Feb 18th, 2023', amount: '1073', avatar: '' },
        { id: 3, name: 'Roxanne Hills', type: 'Salary', status: 'Done', date: 'Apr 16th, 2023', amount: '2,790', avatar: '' },
    ];

    return (
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <h3 className="font-bold text-slate-900 text-lg">Transactions</h3>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 w-full md:w-64" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-slate-400 border-b border-slate-50 uppercase tracking-widest font-black">
                            <th className="pb-4 pl-4 w-10">
                                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-0" />
                            </th>
                            <th className="pb-4 font-black">Receiver</th>
                            <th className="pb-4 font-black">Type</th>
                            <th className="pb-4 font-black">Status</th>
                            <th className="pb-4 font-black">Date</th>
                            <th className="pb-4 font-black text-right pr-8">Amount</th>
                            <th className="pb-4"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-600">
                        {transactions.map(t => (
                            <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                <td className="py-4 pl-4">
                                    <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-0" />
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://ui-avatars.com/api/?name=${t.name}&background=random`} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-bold text-slate-800">{t.name}</span>
                                    </div>
                                </td>
                                <td className="py-4">{t.type}</td>
                                <td className="py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide 
                                ${t.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="py-4 font-bold text-slate-800">{t.date}</td>
                                <td className="py-4 font-black text-slate-900 text-right pr-8">${t.amount}</td>
                                <td className="py-4 text-right">
                                    <button className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
