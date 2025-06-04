import {memo} from 'react';
import {Typography} from '@mui/joy';
import {ActivityItem} from '@components/NewTripForm/TripPlanStep/ActivityItem';
import {DayPlan} from '@customTypes/TripPlan';
import styles from './styles.module.scss';

interface Props {
  dayPlan: DayPlan;
}

const DayPlanItem = memo<Props>(({dayPlan}) => (
  <div className={styles.container}>
    <Typography level="h2">{`Day ${dayPlan.day}`}</Typography>
    <div className={styles.activities}>
      {dayPlan.activities.map(activity => (
        <ActivityItem key={activity.location} activity={activity} />
      ))}
    </div>
  </div>
));

export {DayPlanItem};
