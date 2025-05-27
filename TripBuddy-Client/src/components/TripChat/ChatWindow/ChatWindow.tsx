import {FC, useEffect, useRef, useState} from 'react';
import SendRounded from '@mui/icons-material/SendRounded';
import {Box, IconButton, Input, Typography} from '@mui/joy';
import {Message} from '@customTypes/Message';
import styles from '@styles/tripChat.module.scss';

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

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <Box className={styles.chatWindow}>
      <Box className={styles.messageList}>
        {messages.map(m => (
          <Box key={m._id} className={m.from === selfId ? styles.outgoing : styles.incoming}>
            <Typography level="body-sm">{m.text}</Typography>
            <Typography level="body-xs" textAlign="right">
              {new Date(m.createdAt).toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <Box className={styles.inputArea}>
        <Input
          fullWidth
          variant="soft"
          placeholder="Write a message…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <IconButton variant="soft" onClick={handleSend}>
          <SendRounded />
        </IconButton>
      </Box>
    </Box>
  );
};

export {ChatWindow};
