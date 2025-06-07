import {FC, useEffect, useRef, useState} from 'react';
import SendRounded from '@mui/icons-material/SendRounded';
import {ChatBubble} from '@components/TripChat/ChatWindow/ChatBubble';
import {StyledIconButton} from '@components/common/StyledIconButton';
import {StyledInput} from '@components/common/input/StyledInput';
import {Message} from '@customTypes/Message';
import styles from './styles.module.scss';

interface Props {
  messages: Message[];
  onSend: (text: string) => void;
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
    <div className={styles.container}>
      <div className={styles.messageList}>
        {messages.map(message => (
          <ChatBubble key={message._id} message={message} selfId={selfId} />
        ))}
        <div ref={bottomRef} />
      </div>
      <StyledInput
        placeholder="Enter Message..."
        value={text}
        className={styles.input}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        endDecorator={
          <StyledIconButton onClick={handleSend}>
            <SendRounded />
          </StyledIconButton>
        }
      />
    </div>
  );
};

export {ChatWindow};
