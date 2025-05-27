import {FC, useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router';
import {toast} from 'react-toastify';
import {Grid, Typography} from '@mui/joy';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {ChatWindow} from '@components/TripChat/ChatWindow';
import {ChatUser, TripBuddiesChat} from '@components/TripChat/TripBuddiesChat';
import {ContentCard} from '@components/common/ContentCard';
import {Message} from '@customTypes/Message';
import {useUserContext} from '@contexts/UserContext';
import {useChatSocket} from '@hooks/useChatSocket';
import {useFetch} from '@hooks/useFetch';
import {getConversationHistory, getTripById} from '@services/tripsApi';
import styles from '@styles/tripChat.module.scss';

const TripChat: FC = () => {
  const {user} = useUserContext();
  const {tripId} = useParams();
  const {data: trip} = useFetch(getTripById, tripId ?? '');

  const [selected, setSelected] = useState<ChatUser | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const {sendMessage, subscribe} = useChatSocket(user?._id);

  useEffect(() => {
    if (!selected) return;
    getConversationHistory(tripId!, selected._id)
      .then(setMessages)
      .catch(() => toast.error('Failed to load chat history'));
  }, [selected, trip?.users, tripId, user?.userName]);

  // listen for new messages and update messages state if they are relevant to the selected user
  useEffect(() => {
    const unsubscribe = subscribe((msg: Message) => {
      if (
        (msg.from === selected?._id && msg.to === user?._id) ||
        (msg.to === selected?._id && msg.from === user?._id)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => {
      unsubscribe?.();
    };
  }, [subscribe, selected, user?._id]);

  const handleSend = (text: string) => {
    const temp: Message = {
      _id: crypto.randomUUID(),
      from: user!._id,
      to: selected!._id,
      text,
      read: true,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, temp]);
    sendMessage(selected!._id, text);
  };

  const usersForList = useMemo<ChatUser[]>(() => {
    if (!trip) return [];
    return trip.users
      .filter(u => u._id !== user?._id)
      .map(u => ({
        ...u,
        lastMessage: messages.filter(m => m.from === u._id || m.to === u._id).slice(-1)[0]?.text ?? '',
        unreadCount:
          messages.filter(
            m => m.from === u._id && !m.read // שדה read אם קיים
          ).length ?? 0,
      }));
  }, [trip, messages, user?._id]);

  return (
    <Grid container spacing="16px">
      <Grid xs={3} className={styles.gridItem}>
        <ContentCard className={styles.gridItem}>
          <TitleWithDivider title="My Trip Buddies" />
          <TripBuddiesChat users={usersForList} selectedUserId={selected?._id} onSelect={setSelected} />
        </ContentCard>
      </Grid>

      <Grid xs className={styles.gridItem}>
        <ContentCard className={styles.gridItem}>
          <TitleWithDivider title={selected ? `Chat with ${selected.userName}` : 'Choose a buddy'} />
          {selected ? (
            <ChatWindow messages={messages} onSend={handleSend} selfId={user?._id} />
          ) : (
            <Typography level="body-md">Select a user from the list to start chatting</Typography>
          )}
        </ContentCard>
      </Grid>
    </Grid>
  );
};

export default TripChat;
