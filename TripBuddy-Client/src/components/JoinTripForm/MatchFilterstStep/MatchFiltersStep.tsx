import {FC} from 'react';

interface MatchFiltersStepProps {
  onContinue: () => void;
  onReturn: () => void;
}

export const MatchFiltersStep: FC<MatchFiltersStepProps> = ({onContinue, onReturn}) => {
  return (
    <div>
      <h2>Match Filters</h2>
      <button onClick={onReturn}>Back</button>
      <button onClick={onContinue}>Next</button>
    </div>
  );
};
