import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {searchImages} from '@services/imageSearchApi';

export const useBackgroundImageFromSearch = (query: string | undefined, isLoading: boolean) => {
  const [backgroundImage, setBackgroundImage] = useState<string>();

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      if (!isLoading && query) {
        try {
          const images = await searchImages(query);

          if (images.length > 0) {
            setBackgroundImage(images[0].src.large2x);
          }
        } catch {
          toast.error('Failed to fetch background image');
        }
      }
    };

    fetchBackgroundImage();
  }, [query, isLoading]);

  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.classList.add('with-dark-overlay');
    } else {
      document.body.classList.remove('with-dark-overlay');
    }

    return () => {
      document.body.style.backgroundImage = '';
      document.body.classList.remove('with-dark-overlay');
    };
  }, [backgroundImage]);

  return backgroundImage;
};
