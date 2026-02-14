import React from 'react';

const PaymentItem = ({ name, date, amount, status, avatar }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group">
        <div className="flex items-center gap-4">
            <img
                src={avatar || `https://ui-avatars.com/api/?name=${name}&background=random`}
                alt={name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div>
                <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
                <p className="text-[10px] text-slate-400 font-medium">{date}</p>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <span className="font-black text-slate-900 text-sm">${amount}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide 
            ${status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {status}
            </span>
            <button className="text-slate-300 hover:text-slate-600 text-lg">
                <span className="material-symbols-outlined">more_horiz</span>
            </button>
        </div>
    </div>
);

const RecentPayments = () => {
    // Mock Data
    const payments = [
        { name: 'Emma Ryan Jr.', date: 'Mar 9, 2023', amount: '4,823', status: 'Done' },
        { name: 'Justin Weber', date: 'Mar 2, 2023', amount: '3,937', status: 'Pending' },
    ];

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 text-lg">Recently Payments</h3>
                <button className="text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payments.map((p, i) => (
                    <PaymentItem key={i} {...p} />
                ))}
            </div>
        </div>
    );
};

export default RecentPayments;
