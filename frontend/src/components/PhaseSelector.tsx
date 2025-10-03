import React from 'react';
import { Activity, Droplets } from 'lucide-react';
import { ProcessingPhase } from '../types';

interface PhaseSelectorProps {
  selectedPhase: ProcessingPhase;
  onPhaseChange: (phase: ProcessingPhase) => void;
  disabled?: boolean;
}

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  selectedPhase,
  onPhaseChange,
  disabled = false,
}) => {
  const phases: { value: ProcessingPhase; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: 'arterial',
      label: 'Arteriosa',
      description: 'Increased contrast simulation',
      icon: <Activity className="h-5 w-5" />,
    },
    {
      value: 'venous',
      label: 'Venosa',
      description: 'Gaussian smoothing simulation',
      icon: <Droplets className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {phases.map((phase) => (
        <button
          key={phase.value}
          onClick={() => onPhaseChange(phase.value)}
          disabled={disabled}
          className={`p-4 border-2 rounded-lg text-left transition-all ${
            selectedPhase === phase.value
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                selectedPhase === phase.value
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {phase.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{phase.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
            </div>
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                selectedPhase === phase.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}
            />
          </div>
        </button>
      ))}
    </div>
  );
};