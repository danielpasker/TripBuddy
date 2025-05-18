import React, {FC} from 'react';

interface SearchResultsStepProps {
  results: unknown[];
  onReturn: () => void;
}

export const SearchResultsStep: FC<SearchResultsStepProps> = ({results, onReturn}) => {
  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{JSON.stringify(result)}</li>
        ))}
      </ul>
      <button onClick={onReturn}>Back</button>
    </div>
  );
};
