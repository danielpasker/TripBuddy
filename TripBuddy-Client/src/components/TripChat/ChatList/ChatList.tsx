import {FC} from 'react';
import {Badge, Typography} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {ContentCard} from '@components/common/ContentCard';
import {User} from '@customTypes/User';
import styles from './styles.module.scss';

export interface ChatUser extends User {
  lastMessage?: string;
  unreadCount?: number;
}

interface Props {
  users: ChatUser[];
  selectedUserId?: string;
  onSelect?: (user: ChatUser) => void;
}

const ChatList: FC<Props> = ({users, selectedUserId, onSelect}) => (
  <div className={styles.container}>
    {users.map(user => (
      <ContentCard
        key={user._id}
        onClick={() => onSelect?.(user)}
        className={user._id === selectedUserId ? styles.selectedChatCard : styles.chatCard}>
        <div className={styles.content}>
          <UserAvatar user={user} />
          <Typography level="h4" fontWeight={600} className={styles.username}>
            {`@${user.userName}`}
          </Typography>
          {user.lastMessage && (
            <Typography level="body-lg" noWrap className={styles.lastMessage}>
              {user.lastMessage}
            </Typography>
          )}
        </div>
        {(user.unreadCount ?? 0) > 0 && <Badge color="danger" badgeContent={user.unreadCount} />}
      </ContentCard>
    ))}
  </div>
);

export {ChatList};
