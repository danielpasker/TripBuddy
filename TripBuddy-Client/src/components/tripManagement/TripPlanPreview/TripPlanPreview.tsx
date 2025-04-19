import {FC} from 'react';
import {LocationOnRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {TripPlan} from '@customTypes/TripPlan';
import styles from './styles.module.scss';

interface Props {
  tripPlan: TripPlan;
}

const TripPlanPreview: FC<Props> = ({tripPlan}) => (
  <div className={styles.container}>
    {tripPlan.plan
      .flatMap(dayPlan => dayPlan.activities.map(activity => activity.location))
      .map((location, index) => (
        <div key={index} className={styles.location}>
          <LocationOnRounded className={styles.icon} />
          <Typography level="body-lg" lineHeight="normal">
            {location}
          </Typography>
        </div>
      ))}
  </div>
);

export {TripPlanPreview};
