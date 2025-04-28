import {delay} from 'lodash';
import {useEffect, useState} from 'react';

const useLoadingWithDelay = (isLoading: boolean, delayTime: number = 400) => {
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    if (isLoading !== loading) {
      delay(() => setLoading(isLoading), delayTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return loading;
};

export {useLoadingWithDelay};
