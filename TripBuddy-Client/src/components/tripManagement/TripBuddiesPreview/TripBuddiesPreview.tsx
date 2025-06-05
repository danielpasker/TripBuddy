import {FC} from 'react';
import {Tooltip} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {User} from '@customTypes/User';
import styles from './styles.module.scss';

interface Props {
  tripBuddies: User[];
}

const TripBuddiesPreview: FC<Props> = ({tripBuddies}) => (
  <div className={styles.container}>
    {tripBuddies.map((tripBuddy, index) => (
      <Tooltip key={index} title={tripBuddy.userName}>
        <UserAvatar user={tripBuddy} />
      </Tooltip>
    ))}
  </div>
);

export {TripBuddiesPreview};
