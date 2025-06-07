import {memo, useMemo} from 'react';
import {Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {StyledChip} from '@components/common/StyledChip';
import {Message} from '@customTypes/Message';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  message: Message;
  selfId?: string;
}

const ChatBubble = memo<Props>(({message, selfId}) => {
  const isSelf = useMemo(() => message.senderId === selfId, [message.senderId, selfId]);

  return (
    <ContentCard key={message._id} className={`${styles.container} ${isSelf ? styles.outgoing : styles.incoming}`}>
      <Typography>{message.content}</Typography>
      <StyledChip className={styles.timestamp}>
        <div className={styles.timestampContent}>
          <Typography level="body-sm">{formatDate(message.timestamp, 'dd.MM.yy')}</Typography>
          <Typography level="body-sm" fontWeight={700}>
            {formatDate(message.timestamp, 'hh:mm')}
          </Typography>
        </div>
      </StyledChip>
    </ContentCard>
  );
});

export {ChatBubble};
