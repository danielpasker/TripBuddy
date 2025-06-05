import {memo, useCallback, useMemo, useState} from 'react';
import {LocationOnRounded, NewReleasesRounded, VerifiedRounded} from '@mui/icons-material';
import {Skeleton, Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {Activity} from '@customTypes/TripPlan';
import {useFetch} from '@hooks/useFetch';
import {searchImages} from '@services/imageSearchApi';
import styles from './styles.module.scss';

interface Props {
  activity: Activity;
}

const ActivityItem = memo<Props>(({activity}) => {
  const {data: images, isFetching} = useFetch(searchImages, activity.location);
  const [isImageLoading, setIsImageLoading] = useState(activity.isValid);

  const imageUrl = useMemo(() => images?.[0]?.src.large2x, [images]);
  const onLoadImage = useCallback(() => setIsImageLoading(false), []);

  return (
    <ContentCard className={styles.container}>
      <div className={styles.activityContent}>
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
          {activity.isCustom ? (
            <div className={styles.customActivity}>
              <Typography lineHeight="normal" level="body-sm">
                Custom Activity
              </Typography>
            </div>
          ) : activity.isValid ? (
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
      {activity.isValid && (
        <>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={activity.location}
              onLoad={onLoadImage}
              className={`${styles.activityImage} ${isImageLoading ? styles.hidden : ''}`}
            />
          )}
          {(isFetching || (imageUrl && isImageLoading)) && (
            <Skeleton variant="rectangular" animation="wave" className={styles.activityImage} />
          )}
        </>
      )}
    </ContentCard>
  );
});

export {ActivityItem};
