import {memo, useCallback} from 'react';
import {CheckRounded, CloseRounded} from '@mui/icons-material';
import {Tooltip, Typography} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {JoinRequestPreview} from '@customTypes/JoinRequest';
import styles from './styles.module.scss';

interface Props {
  joinRequest: JoinRequestPreview;
  requiredUsersAmount: number;
  onAccept: (joinRequestId: string) => void;
  onDecline: (joinRequestId: string) => void;
}

const JoinRequestItem = memo<Props>(({joinRequest, requiredUsersAmount, onAccept, onDecline}) => {
  const handleAccept = useCallback(() => onAccept(joinRequest._id), [onAccept, joinRequest._id]);
  const handleDecline = useCallback(() => onDecline(joinRequest._id), [onDecline, joinRequest._id]);

  return (
    <ContentCard className={styles.container}>
      <UserAvatar user={joinRequest.user} />
      <Typography>{joinRequest.user.userName}</Typography>
      <Tooltip
        title={
          joinRequest.approvingUsers.length > 0
            ? `Approved by ${joinRequest.approvingUsers.map(({userName}) => userName).join(', ')}`
            : 'No one has approved yet'
        }>
        <Typography>{`(${joinRequest.approvingUsers.length}/${requiredUsersAmount})`}</Typography>
      </Tooltip>
      <div className={styles.actions}>
        <StyledButton startDecorator={<CheckRounded />} variant="plain" color="success" onClick={handleAccept}>
          Approve
        </StyledButton>
        <StyledButton startDecorator={<CloseRounded />} variant="plain" color="danger" onClick={handleDecline}>
          Decline
        </StyledButton>
      </div>
    </ContentCard>
  );
});

export {JoinRequestItem};
