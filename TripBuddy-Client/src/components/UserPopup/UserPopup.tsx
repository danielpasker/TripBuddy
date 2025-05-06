import {FC} from 'react';
import {Typography} from '@mui/joy';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {UserAvatar} from '@components/UserAvatar';
import {ContentCard} from '@components/common/ContentCard';
import {Popup} from '@components/common/Popup';
import {UserDetails} from '@components/profile/UserDetails';
import {User} from '@customTypes/User';
import styles from './styles.module.scss';

interface Props {
  open: boolean;
  user: User;
  onClose: () => void;
}

const UserPopup: FC<Props> = ({open, user, onClose}) => (
  <Popup open={open} title="User Preview" cancelText="Close" onCancel={onClose}>
    <div className={styles.container}>
      <div className={styles.username}>
        <UserAvatar className={styles.avatar} user={user} />
        <Typography level="h2" fontWeight={700}>
          {`@${user.userName}`}
        </Typography>
      </div>
      <ContentCard>
        <Typography level="h4">{user?.description ?? 'No description provided'}</Typography>
      </ContentCard>
      <TitleWithDivider title="User Details" />
      <ContentCard>
        <UserDetails user={user} />
      </ContentCard>
    </div>
  </Popup>
);
export {UserPopup};
