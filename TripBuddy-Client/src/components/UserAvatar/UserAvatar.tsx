import {memo, useState} from 'react';
import {Avatar, AvatarProps, styled} from '@mui/joy';
import {UserPopup} from '@components/UserPopup';
import {User} from '@customTypes/User';

const StyledAvatar = styled(Avatar)(() => ({
  width: 45,
  height: 45,
  '&.MuiAvatar-sizeLg': {
    width: 245,
    height: 245,
    fontSize: 100,
  },
}));

interface Props extends Omit<AvatarProps, 'size' | 'src'> {
  user: User;
  sizeLg?: true;
  disablePopup?: true;
}

const UserAvatar = memo<Props>(({user, sizeLg, disablePopup, ...props}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleAvatarClick = () => setIsPopupOpen(true);
  const onPopupClose = () => setIsPopupOpen(false);

  return (
    <>
      <StyledAvatar
        size={sizeLg ? 'lg' : undefined}
        alt={user.userName.toUpperCase()}
        src={user.profileImageUrl ?? undefined}
        onClick={props.onClick ?? (disablePopup ? undefined : handleAvatarClick)}
        style={{cursor: disablePopup ? 'default' : 'pointer'}}
        {...props}
      />
      {!disablePopup && <UserPopup open={isPopupOpen} user={user} onClose={onPopupClose} />}
    </>
  );
});

export {UserAvatar};
