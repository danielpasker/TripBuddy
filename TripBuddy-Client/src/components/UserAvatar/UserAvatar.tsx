import {Avatar, AvatarProps, styled} from '@mui/joy';
import {User} from '@customTypes/User';

interface Props extends Omit<AvatarProps, 'size' | 'src'> {
  user: User;
  sizeLg?: true;
  selectable?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserAvatar = styled(({user, sizeLg, selectable, ...props}: Props) => (
  <Avatar
    size={sizeLg ? 'lg' : undefined}
    alt={user.userName.toUpperCase()}
    src={user.profileImageUrl ?? undefined}
    {...props}
  />
))(({selectable}) => ({
  width: 45,
  height: 45,
  cursor: selectable ? 'pointer' : 'auto',
  '&.MuiAvatar-sizeLg': {
    width: 245,
    height: 245,
    fontSize: 100,
  },
}));

export {UserAvatar};
