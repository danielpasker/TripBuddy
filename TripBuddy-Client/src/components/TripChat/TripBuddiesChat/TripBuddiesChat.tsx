import {FC} from 'react';
import {Badge, Box, List, ListItem, ListItemButton, Typography} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
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
  showUnreadBadge?: boolean;
}

const TripBuddiesChat: FC<Props> = ({users, selectedUserId, onSelect, showUnreadBadge = true}) => (
  <List className={styles.container} orientation="vertical" sx={{p: 0}}>
    {users.map(user => (
      <ListItem key={user._id}>
        <ListItemButton className={styles.item} selected={user._id === selectedUserId} onClick={() => onSelect?.(user)}>
          <Box className={styles.avatar}>
            <UserAvatar user={user} />
          </Box>

          <Box className={styles.text}>
            <Typography level="title-sm" fontWeight={600}>
              {user.userName}
            </Typography>
            <Typography level="title-sm" noWrap className={styles.lastMessage}>
              {user.lastMessage ?? ''}
            </Typography>
          </Box>

          {showUnreadBadge && (user.unreadCount ?? 0) > 0 && (
            <Badge color="danger" badgeContent={user.unreadCount} className={styles.badge} />
          )}
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);

export {TripBuddiesChat};
