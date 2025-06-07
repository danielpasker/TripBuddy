import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router';
import {toast} from 'react-toastify';
import {ChatList, ChatUser} from 'src/components/TripChat/ChatList';
import {ArrowBack} from '@mui/icons-material';
import {Grid, Typography} from '@mui/joy';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {ChatWindow} from '@components/TripChat/ChatWindow';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {Message} from '@customTypes/Message';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useChatSocket} from '@hooks/useChatSocket';
import {useFetch} from '@hooks/useFetch';
import {createOrGetChat} from '@services/chatApi';
import {getTripById} from '@services/tripsApi';
import styles from '@styles/tripChat.module.scss';

type BuddyChatMap = Record<string, string>;

const TripChat: FC = () => {
  const navigate = useNavigate();
  const {user} = useUserContext();
  const {tripId = ''} = useParams();

  const {data: trip, error: tripError} = useFetch(getTripById, tripId);

  const [selectedUser, setSelectedUser] = useState<ChatUser>();
  const [chatId, setChatId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [buddyChatMap, setBuddyMap] = useState<BuddyChatMap>({});

  const {joinChat, sendMessage, subscribe, markRead} = useChatSocket(user?._id);

  const markLocalRead = useCallback(
    (chatId: string) =>
      setMessages(prev =>
        prev.map(m =>
          m.chatId === chatId && !m.readBy?.includes(user!._id) ? {...m, readBy: [...(m.readBy ?? []), user!._id]} : m
        )
      ),
    [user]
  );

  useEffect(() => {
    if (!trip || !user) return;

    const buddies = trip.users.filter(b => b._id !== user._id);

    Promise.all(buddies.map(b => createOrGetChat([user._id, b._id]))).then(resArr => {
      const map: BuddyChatMap = {};
      resArr.forEach(({chat}) => {
        const buddyId = chat.participantsIds.find(id => id !== user._id)!;
        map[buddyId] = chat._id;
      });
      setBuddyMap(map);

      const allMessages = resArr.flatMap(r => r.messages);
      setMessages(prev => {
        const ids = new Set(prev.map(m => m._id));
        return [...prev, ...allMessages.filter(m => !ids.has(m._id))];
      });
    });
  }, [trip, user]);

  useEffect(() => {
    if (!selectedUser || !user) return;
    const chatId = buddyChatMap[selectedUser._id];
    if (!chatId) return;

    setChatId(chatId);
    joinChat(chatId);
    markRead(chatId);
    markLocalRead(chatId);

    createOrGetChat([user._id, selectedUser._id]).then(({messages}) =>
      setMessages(prev => {
        const ids = new Set(prev.map(m => m._id));
        return [...prev, ...messages.filter(m => !ids.has(m._id))];
      })
    );
  }, [selectedUser, user, buddyChatMap, joinChat, markRead, markLocalRead]);

  useEffect(() => {
    const unSubscribe = subscribe(msg => {
      setMessages(prev => [...prev, msg]);
      if (msg.chatId === chatId) {
        markRead(chatId!);
        markLocalRead(chatId!);
      }
    });
    return () => unSubscribe?.();
  }, [chatId, subscribe, markRead, markLocalRead]);

  const handleSend = (content: string) => {
    if (!chatId || !user) return;
    sendMessage(chatId, content, new Date());
  };

  const usersForList = useMemo<ChatUser[]>(() => {
    if (!trip || !user) return [];

    return trip.users
      .filter(u => u._id !== user._id)
      .map(u => {
        const chatId = buddyChatMap[u._id];
        const related = messages.filter(m => m.chatId === chatId);
        const lastMsg = related.slice(-1)[0]?.content ?? '';
        const unread = related.filter(m => m.senderId === u._id && !m.readBy?.includes(user._id)).length;

        return {...u, lastMessage: lastMsg, unreadCount: unread};
      });
  }, [trip, messages, buddyChatMap, user]);

  useEffect(() => {
    if (tripError) toast.error('Failed to load trip');
  }, [tripError]);

  const handleReturn = useCallback(() => {
    navigate(`${ClientRoutes.TRIPS}/${tripId}`);
  }, [navigate, tripId]);

  return (
    <Grid container spacing="16px">
      <Grid xs={3} className={styles.gridItem}>
        <ContentCard className={styles.gridItem}>
          <TitleWithDivider title="My Trip Buddies" />
          <ChatList users={usersForList} selectedUserId={selectedUser?._id} onSelect={setSelectedUser} />
          <StyledButton className={styles.returnButton} onClick={handleReturn} startDecorator={<ArrowBack />}>
            Return to Trip
          </StyledButton>
        </ContentCard>
      </Grid>
      <Grid xs className={styles.gridItem}>
        <ContentCard className={styles.chatWindow}>
          {selectedUser ? (
            <>
              <TitleWithDivider title={`Chat with @${selectedUser.userName}`} />
              <ChatWindow messages={messages.filter(m => m.chatId === chatId)} onSend={handleSend} selfId={user?._id} />
            </>
          ) : (
            <div className={styles.emptyState}>
              <Typography level="h1" fontWeight={700}>
                No Buddy Selected
              </Typography>
              <Typography level="h2">Select a user from the list to start chatting</Typography>
            </div>
          )}
        </ContentCard>
      </Grid>
    </Grid>
  );
};

export default TripChat;
