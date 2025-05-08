// components/JoinTripForm/BasicFiltersStep/BasicFiltersStep.tsx
import React from 'react';

interface LogisticFiltersStepProps {
  isSearching: boolean;
  onSubmit: () => void;
  onReturn: () => void;
}

export const LogisticFiltersStep: React.FC<LogisticFiltersStepProps> = ({isSearching, onSubmit, onReturn}) => (
  <div>
    <button onClick={onReturn}>Back</button>
    <button onClick={onSubmit} disabled={isSearching}>
      Next
    </button>
  </div>
);
