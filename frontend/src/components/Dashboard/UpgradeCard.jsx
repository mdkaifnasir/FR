import React from 'react';

const UpgradeCard = () => {
    return (
        <div className="bg-gradient-to-br from-teal-400 to-teal-600 p-6 rounded-3xl shadow-lg shadow-teal-200/50 text-white relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <span className="material-symbols-outlined text-6xl">verified</span>
            </div>

            <div className="z-10">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-black">$95.9</h2>
                    <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <p className="text-teal-100 text-sm font-medium mb-1">Per Month</p>
                <h3 className="text-xl font-bold leading-tight mt-4 mb-2">Choose Best Plan For You!</h3>
            </div>

            <div className="mt-4 z-10 flex gap-3">
                <button className="flex-1 py-2 px-4 bg-white/20 backdrop-blur-md rounded-xl text-sm font-bold border border-white/30 hover:bg-white/30 transition-colors">
                    Details
                </button>
                <button className="flex-1 py-2 px-4 bg-black text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-900 transition-colors">
                    Upgrade
                </button>
            </div>
        </div>
    );
};

export default UpgradeCard;
