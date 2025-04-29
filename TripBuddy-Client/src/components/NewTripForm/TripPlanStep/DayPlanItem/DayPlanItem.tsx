import {memo} from 'react';
import {LocationOnRounded, NewReleasesRounded, VerifiedRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
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
        <ContentCard key={activity.location}>
          <div className={styles.activity}>
            <Typography level="body-lg" lineHeight="normal">
              {activity.activity}
            </Typography>
            <div className={styles.activityLocation}>
              <div className={styles.iconAndText}>
                <LocationOnRounded className={styles.icon} />
                <Typography lineHeight="normal" level="body-sm">
                  {activity.location}
                </Typography>
              </div>
              {activity.isValid ? (
                <div className={styles.iconAndText}>
                  <VerifiedRounded className={styles.icon} />
                  <Typography lineHeight="normal" level="body-sm">
                    Verified Location
                  </Typography>
                </div>
              ) : (
                <div className={styles.unverifiedLocation}>
                  <NewReleasesRounded className={styles.icon} />
                  <Typography lineHeight="normal" fontWeight={400} level="body-md" className={styles.text}>
                    Unverified Location. Please check for details.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </ContentCard>
      ))}
    </div>
  </div>
));

export {DayPlanItem};
