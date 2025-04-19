import {FC} from 'react';
import {Tooltip} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {User} from '@customTypes/User';
import {useUserContext} from '@contexts/UserContext';
import styles from './styles.module.scss';

interface Props {
  tripBuddies: User[];
}

const TripBuddiesPreview: FC<Props> = ({tripBuddies}) => {
  const {user} = useUserContext();

  return (
    <div className={styles.container}>
      {tripBuddies
        .filter(({_id}) => _id !== user?._id)
        .map((tripBuddy, index) => (
          <Tooltip key={index} title={tripBuddy.userName}>
            <UserAvatar user={tripBuddy} />
          </Tooltip>
        ))}
    </div>
  );
};

export {TripBuddiesPreview};
