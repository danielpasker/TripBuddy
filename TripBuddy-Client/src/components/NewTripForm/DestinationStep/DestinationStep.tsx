import { FC, useState, useMemo } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { NavigateNextRounded } from '@mui/icons-material';
import LanguageIcon from '@mui/icons-material/Language';
import { Typography } from '@mui/joy';
import { StyledButton } from '@components/common/StyledButton';
import { ContentCard } from '@components/common/ContentCard';
import { StyledInput } from '@components/common/input/StyledInput';
import styles from './styles.module.scss';

interface Destination {
  city: string;
  country: string;
}

const recommendedDestinations: Destination[] = [
  { city: 'Paris', country: 'France' },
  { city: 'New York', country: 'USA' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'London', country: 'England' },
];

interface Props {
  onContinue: () => void;
}

const DestinationStep: FC<Props> = ({ onContinue }) => {
  const { control, setValue } = useFormContext();
  const { field, fieldState } = useController({ control, name: 'location' });
  const [selectedDestination, setSelectedDestination] = useState<string>(field.value || '');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredDestinations = useMemo(() => {
    if (!searchTerm) return recommendedDestinations;
    return recommendedDestinations.filter(dest =>
      `${dest.city}, ${dest.country}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelectDestination = (city: string, country: string) => {
    const fullLocation = `${city}, ${country}`;
    setSelectedDestination(fullLocation);
    setValue('location', fullLocation, { shouldValidate: true });
  };

  return (
    <div className={styles.container}>
      <StyledInput
        placeholder="Pick your desired destination"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className={styles.searchInput}
        endDecorator={<LanguageIcon />}
      />
      <div className={styles.destinationsGrid}>
        {filteredDestinations.map((dest, index) => {
          const fullLocation = `${dest.city}, ${dest.country}`;
          const isSelected = selectedDestination === fullLocation;
          return (
            <ContentCard
              key={index}
              className={`${styles.destinationCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleSelectDestination(dest.city, dest.country)}
            >
              <Typography level="h4" className={styles.destinationName}>
                {dest.city}
              </Typography>
              <Typography level="body-md" className={styles.destinationCountry}>
                {dest.country}
              </Typography>
            </ContentCard>
          );
        })}
      </div>
      <StyledButton
        disabled={!selectedDestination || !!fieldState.error}
        onClick={onContinue}
        endDecorator={<NavigateNextRounded />}
      >
        Continue
      </StyledButton>
    </div>
  );
};

export { DestinationStep };
