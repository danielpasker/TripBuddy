import {compareDesc} from 'date-fns';
import {FC} from 'react';
import {Skeleton} from '@mui/joy';
import {TripItem} from '@components/TripItem';
import {ContentCard} from '@components/common/ContentCard';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {getUserTrips} from '@services/usersApi';
import styles from './styles.module.scss';

interface Props {
  userId: string;
}

const TripList: FC<Props> = ({userId}) => {
  const {data: trips = [], isFetching} = useFetch(getUserTrips, userId);
  const showLoading = useLoadingWithDelay(isFetching);

  return (
    <div className={styles.container}>
      {showLoading
        ? Array.from({length: 4}).map((_, index) => (
            <ContentCard key={index} className={styles.skeletonContainer}>
              <div className={styles.skeletonTitle}>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={200} height={20} />
              </div>
              <Skeleton variant="rectangular" height={30} width={48} />
            </ContentCard>
          ))
        : trips
            ?.sort((a, b) => compareDesc(a.startDate, b.startDate))
            .map(trip => <TripItem trip={trip} key={trip._id} />)}
    </div>
  );
};

export {TripList};
