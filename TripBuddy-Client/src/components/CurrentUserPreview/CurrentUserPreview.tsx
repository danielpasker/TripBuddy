import {ChangeEvent, FC, useRef} from 'react';
import {Skeleton, Typography} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {LoggedUser} from '@customTypes/User';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {getUserTrips} from '@services/usersApi';
import styles from './styles.module.scss';

interface Props {
  user: LoggedUser | null;
  onUpdateProfilePicture: (file: File) => void;
}

const CurrentUserPreview: FC<Props> = ({user, onUpdateProfilePicture}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {data: trips = [], isFetching} = useFetch(getUserTrips, user?._id ?? '');
  const showLoading = useLoadingWithDelay(isFetching);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      onUpdateProfilePicture(file);
    }
  };

  return user && !showLoading ? (
    <div className={styles.profileContainer}>
      <UserAvatar selectable user={user} sizeLg onClick={() => fileInputRef.current?.click()} />
      <input type="file" ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handleFileChange} />
      <div className={styles.detailsContainer}>
        <Typography level="h2" fontWeight={700}>
          {`@${user.userName}`}
        </Typography>
        <Typography level="h2">{`${trips.length} Trips`}</Typography>
      </div>
    </div>
  ) : (
    <div className={styles.profileContainer}>
      <Skeleton variant="circular" width={245} height={245} />
      <div className={styles.detailsContainer}>
        <Skeleton animation="wave" variant="text" width={200} height={40} />
        <Skeleton animation="wave" variant="text" width={100} height={40} />
      </div>
    </div>
  );
};

export {CurrentUserPreview};
