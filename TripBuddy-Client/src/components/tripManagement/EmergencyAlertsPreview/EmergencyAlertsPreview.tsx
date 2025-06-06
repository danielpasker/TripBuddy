import {FC} from 'react';
import {Skeleton, Typography} from '@mui/joy';
import {AlertItem} from '@components/AlertItem';
import {ContentCard} from '@components/common/ContentCard';
import {StyledChip} from '@components/common/StyledChip';
import {Alert} from '@customTypes/Alert';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import styles from './styles.module.scss';

const PREVIEW_COUNT = 5;

interface Props {
  alerts: Alert[];
  isFetching: boolean;
}

const EmergencyAlertsPreview: FC<Props> = ({alerts, isFetching}) => {
  const showLoading = useLoadingWithDelay(isFetching);

  return (
    <div className={alerts.length ? styles.container : styles.emptyContainer}>
      {showLoading ? (
        Array.from({length: 3}).map((_, index) => (
          <ContentCard key={index} className={styles.skeleton}>
            <Skeleton animation="wave" variant="text" width="100%" />
            <Skeleton animation="wave" variant="text" width="100%" />
            <Skeleton animation="wave" variant="text" width="100%" />
          </ContentCard>
        ))
      ) : alerts.length ? (
        <>
          {alerts.slice(0, PREVIEW_COUNT).map(alert => (
            <AlertItem isPreview alert={alert} key={alert.eventId} />
          ))}
          {alerts.length > PREVIEW_COUNT && (
            <StyledChip className={styles.chip}>{`And ${alerts.length - 4} more`}</StyledChip>
          )}
        </>
      ) : (
        <Typography level="h4">There are no alerts during your trip.</Typography>
      )}
    </div>
  );
};

export {EmergencyAlertsPreview};
