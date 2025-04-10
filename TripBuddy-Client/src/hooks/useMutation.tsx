import {useState} from 'react';

interface UseMutationResult<T, K> {
  isLoading: boolean;
  isSuccess: boolean;
  trigger: (...args: K[]) => Promise<T>;
}

const useMutation = <T, K>(mutationFunction: (...args: K[]) => Promise<T>): UseMutationResult<T, K> => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const trigger = async (...args: K[]) => {
    try {
      setIsLoading(true);
      const result = await mutationFunction(...args);

      setIsLoading(false);
      setIsSuccess(true);

      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  return {isLoading, isSuccess, trigger};
};

export {useMutation};
