import React from 'react';

const StepIndicator = ({ currentStep, steps }) => {
    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className={`flex items-center`}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
              ${index + 1 <= currentStep ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}>
                            {index + 1}
                        </div>
                        <div className="ml-2 text-sm font-medium hidden sm:block">
                            <span className={index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-500'}>{step}</span>
                        </div>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-12 h-1 mx-2 ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default StepIndicator;
