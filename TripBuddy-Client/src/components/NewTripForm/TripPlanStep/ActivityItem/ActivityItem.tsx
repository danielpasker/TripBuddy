import {memo, useCallback, useMemo, useState} from 'react';
import {EmojiPeopleRounded, LocationOnRounded, NewReleasesRounded, VerifiedRounded} from '@mui/icons-material';
import {Skeleton, Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {StyledChip} from '@components/common/StyledChip';
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
        <div className={styles.chipsContainer}>
          <StyledChip size="md" startDecorator={<LocationOnRounded className={styles.icon} />}>
            {activity.location}
          </StyledChip>
          {activity.isCustom ? (
            <StyledChip size="md" color="warning" startDecorator={<EmojiPeopleRounded />}>
              Custom Activity
            </StyledChip>
          ) : activity.isValid ? (
            <StyledChip size="md" color="success" startDecorator={<VerifiedRounded className={styles.icon} />}>
              Verified Location
            </StyledChip>
          ) : (
            <StyledChip color="danger" size="md" startDecorator={<NewReleasesRounded className={styles.icon} />}>
              Unverified Location. Please check for details
            </StyledChip>
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
