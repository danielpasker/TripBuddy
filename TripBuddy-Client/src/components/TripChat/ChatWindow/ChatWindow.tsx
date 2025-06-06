import {FC, useEffect, useRef, useState} from 'react';
import SendRounded from '@mui/icons-material/SendRounded';
import {Box, IconButton, Typography} from '@mui/joy';
import {StyledInput} from '@components/common/input/StyledInput';
import {Message} from '@customTypes/Message';
import styles from './styles.module.scss';

interface Props {
  messages: Message[];
  onSend: (txt: string) => void;
  selfId?: string;
}

const ChatWindow: FC<Props> = ({messages, onSend, selfId}) => {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <Box className={styles.chatWindow}>
      <Box className={styles.messageList}>
        {messages.map(m => {
          const isSelf = m.senderId === selfId;
          return (
            <Box key={m._id} className={`${styles.bubble} ${isSelf ? styles.outgoing : styles.incoming}`}>
              <Typography className={styles.text}>{m.content}</Typography>
              <Typography className={styles.timestamp}>
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Box>
      <StyledInput
        fullWidth
        placeholder="Enter message"
        variant="soft"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        endDecorator={
          <IconButton variant="solid" onClick={handleSend}>
            <SendRounded />
          </IconButton>
        }></StyledInput>
    </Box>
  );
};

export {ChatWindow};
