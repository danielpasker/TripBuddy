import {memo, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {TripPreview} from '@customTypes/Trip';
import {ClientRoutes} from '@enums/clientRoutes';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  trip: TripPreview;
}

const TripItem = memo<Props>(({trip}) => {
  const navigate = useNavigate();

  const onTripClick = useCallback(() => {
    navigate(`${ClientRoutes.TRIPS}/${trip._id}`);
  }, [navigate, trip._id]);

  return (
    <ContentCard className={styles.container} onClick={onTripClick}>
      <div className={styles.title}>
        <Typography level="h3" fontWeight={700} className={styles.gothicFont}>
          {trip.location}
        </Typography>
        <Typography level="body-md">{`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`}</Typography>
      </div>
      <div className={styles.content}>
        <img
          className={styles.flag}
          src={`https://flagsapi.com/${trip.countryCode}/flat/48.png`}
          alt={`flag_${trip.countryCode}`}
        />
      </div>
    </ContentCard>
  );
});
export {TripItem};
