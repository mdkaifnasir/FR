import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendValue, color, subText }) => {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-shadow">
            {/* Background shape for visual interest */}
            <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${color}-50 rounded-full opacity-50 group-hover:scale-125 transition-transform`}></div>

            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-slate-500 font-bold text-sm mb-1">{title}</h3>
                    <h2 className="text-3xl font-black text-slate-800">{value}</h2>
                </div>
                <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-500`}>
                    {/* Using material symbols if available, else fallback */}
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 z-10">
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend === 'up' ? '+' : ''}{trendValue}
                    </span>
                )}
                <span className="text-xs text-slate-400 font-semibold">{subText}</span>
            </div>
        </div>
    );
};

export default StatsCard;
