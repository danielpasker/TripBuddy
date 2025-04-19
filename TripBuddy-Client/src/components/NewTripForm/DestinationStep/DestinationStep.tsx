import { debounce } from 'lodash';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { NavigateNextRounded } from '@mui/icons-material';
import LanguageIcon from '@mui/icons-material/Language';
import { Skeleton, Typography } from '@mui/joy';
import { ContentCard } from '@components/common/ContentCard';
import { StyledButton } from '@components/common/StyledButton';
import { StyledInput } from '@components/common/input/StyledInput';
import { useLoadingWithDelay } from '@hooks/useLoadingWithDelay';
import { useMutation } from '@hooks/useMutation';
import { getDestinations } from '@services/destinationsApi';
import styles from './styles.module.scss';
import { Destination } from '@customTypes/Destination';


const recommendedDestinations: Destination[] = [
  { city: 'Paris', country: 'France' },
  { city: 'New York', country: 'USA' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'London', country: 'United Kingdom' },
];

interface Props {
  onContinue: () => void;
}

const DestinationStep: FC<Props> = ({ onContinue }) => {
  const { control, setValue } = useFormContext();
  const { field, fieldState } = useController({ control, name: 'location' });
  const [searchResults, setSearchResults] = useState<Destination[] | null>(null);
  const { trigger: searchDestination, isLoading } = useMutation(getDestinations);

  const destinationsToDisplay = useMemo(
    () => (searchResults !== null ? searchResults : recommendedDestinations),
    [searchResults]
  );

  const handleSelectDestination = (fullLocation: string) => {
    setValue('location', fullLocation, { shouldValidate: true });
  };

  const updateDestinations = async ({ target: { value: searchTerm } }: ChangeEvent<HTMLInputElement>) => {
    if (searchTerm.length > 1) {
      try {
        const result = await searchDestination(searchTerm);
        setSearchResults(Array.from(new Set(result)));
      } catch {
        setSearchResults(null);
      }
    } else {
      setSearchResults(null);
    }
  };

  const updateDestinationsDelayed = debounce(updateDestinations, 300);
  const showLoading = useLoadingWithDelay(isLoading, 300);

  return (
    <div className={styles.container}>
      <StyledInput
        placeholder="Pick your desired destination"
        onChange={updateDestinationsDelayed}
        className={styles.searchInput}
        endDecorator={<LanguageIcon />}
      />
      <Typography level="h2">
        {searchResults === null || showLoading ? 'Recommended Destinations' : 'Search Results'}
      </Typography>
      <div className={styles.destinationsGrid}>
        {showLoading
          ? Array.from({ length: 5 }).map((_, index) => (
            <ContentCard key={index} className={styles.destinationCard}>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="30%" height={20} />
            </ContentCard>
          ))
          : destinationsToDisplay?.map(dest => {
            const fullLocation = dest.state ? `${dest.city}, ${dest.state}, ${dest.country}` : `${dest.city}, ${dest.country}`;
            const isSelected = field.value === fullLocation;

            return (
              <ContentCard
                key={fullLocation}
                className={isSelected ? styles.selectedDestinationCard : styles.destinationCard}
                onClick={() => handleSelectDestination(fullLocation)}>
                <Typography level="h4" fontWeight={600} className={styles.destinationText}>
                  {dest.city}
                </Typography>
                {dest.state && (
                  <Typography level="body-md" className={styles.destinationText}>
                    {dest.state}
                  </Typography>
                )}
                <Typography level="body-md" className={styles.destinationText}>
                  {dest.country}
                </Typography>
              </ContentCard>
            );
          })};
      </div>
      <StyledButton
        disabled={!field.value || !!fieldState.error}
        onClick={onContinue}
        endDecorator={<NavigateNextRounded />}>
        Continue
      </StyledButton>
    </div>
  );
};

export { DestinationStep };
