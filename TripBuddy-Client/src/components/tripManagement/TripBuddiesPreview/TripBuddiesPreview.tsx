import {FC, useState} from 'react';
import {Tooltip} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {UserPopup} from '@components/UserPopup';
import {User} from '@customTypes/User';
import {useUserContext} from '@contexts/UserContext';
import styles from './styles.module.scss';

interface Props {
  tripBuddies: User[];
}

const TripBuddiesPreview: FC<Props> = ({tripBuddies}) => {
  const {user} = useUserContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>(tripBuddies[0]);

  return (
    <div className={styles.container}>
      {tripBuddies
        .filter(({_id}) => _id !== user?._id)
        .map((tripBuddy, index) => (
          <Tooltip key={index} title={tripBuddy.userName}>
            <UserAvatar
              selectable
              user={tripBuddy}
              onClick={() => {
                setSelectedUser(tripBuddy);
                setIsPopupOpen(true);
              }}
            />
          </Tooltip>
        ))}
      <UserPopup
        open={isPopupOpen}
        user={selectedUser}
        onClose={() => {
          setIsPopupOpen(false);
        }}
      />
    </div>
  );
};

export {TripBuddiesPreview};
