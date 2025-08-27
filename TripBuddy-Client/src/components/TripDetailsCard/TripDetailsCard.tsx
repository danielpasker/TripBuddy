import {FC, PropsWithChildren} from 'react';
import {Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {TripPlan} from '@customTypes/TripPlan';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props extends PropsWithChildren {
  tripPlan?: TripPlan;
  startDate?: string;
  endDate?: string;
}

const TripDetailsCard: FC<Props> = ({tripPlan, startDate, endDate, children}) => (
  <ContentCard>
    <div className={styles.container}>
      <div className={styles.location}>
        <Typography level="h1" lineHeight="normal" className={styles.gothicFont}>
          {tripPlan?.location}
        </Typography>
        <Typography level="h1" fontWeight={300} lineHeight="normal">
          {tripPlan?.countryCode}
        </Typography>
        <img
          className={styles.flag}
          src={`https://flagsapi.com/${tripPlan?.countryCode}/flat/48.png`}
          alt={`flag_${tripPlan?.countryCode}`}
        />
      </div>
      {!!startDate && !!endDate && (
        <Typography level="h3">{`${formatDate(startDate)} - ${formatDate(endDate)}`}</Typography>
      )}
      <div className={styles.detailsAndChildren}>
        <div className={styles.details}>
          <Typography level="body-lg">{`Days: ${tripPlan?.days}`}</Typography>
          <Typography level="body-lg">{`Budget: ${tripPlan?.budget}`}</Typography>
          <Typography level="body-lg">{`Type: ${tripPlan?.tripType}`}</Typography>
          <Typography level="body-lg">{`Participants: ${tripPlan?.participants}`}</Typography>
        </div>
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  </ContentCard>
);

export {TripDetailsCard};
