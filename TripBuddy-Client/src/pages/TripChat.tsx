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
import {createOrGetChat} from '@services/chatApi';
import {getTripById} from '@services/tripsApi';
import styles from '@styles/tripChat.module.scss';

const TripChat: FC = () => {
  const {user} = useUserContext();
  const {tripId = ''} = useParams();
  const {data: trip, error: tripError} = useFetch(getTripById, tripId);
  const [selected, setSelected] = useState<ChatUser | undefined>();
  const [chatId, setChatId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const {joinChat, sendMessage, subscribe} = useChatSocket(user?._id);

  useEffect(() => {
    if (!selected || !user) return;

    createOrGetChat([user._id, selected._id])
      .then(({chat, messages}) => {
        setChatId(chat._id);
        setMessages(messages);
        joinChat(chat._id);
      })
      .catch(() => toast.error('Failed to load chat history'));
  }, [selected, user, joinChat]);

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = subscribe(msg => {
      if (msg.chatId === chatId) setMessages(prev => [...prev, msg]);
    });
    return () => unsubscribe?.();
  }, [chatId, subscribe]);

  const handleSend = (content: string) => {
    if (!chatId || !user || !selected) return;

    sendMessage(chatId, content, new Date());
  };

  const usersForList = useMemo<ChatUser[]>(() => {
    if (!trip) return [];
    return trip.users
      .filter(u => u._id !== user?._id)
      .map(u => {
        const lastMsg = [...messages]
          .filter(m => m.senderId === u._id || m.senderId === user?._id)
          .slice(-1)[0]?.content;

        return {
          ...u,
          lastMessage: lastMsg ?? '',
          unreadCount: 0,
        };
      });
  }, [trip, messages, user?._id]);

  useEffect(() => {
    if (tripError) toast.error('Failed to load trip');
  }, [tripError]);

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
