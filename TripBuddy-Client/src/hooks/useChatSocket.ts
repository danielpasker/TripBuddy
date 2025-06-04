import Cookies from 'js-cookie';
import {useCallback, useEffect, useRef} from 'react';
import createSocket from 'socket.io-client';
import {Message} from '@customTypes/Message';

type Listener = (msg: Message) => void;
type ClientSocket = ReturnType<typeof createSocket>;

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const useChatSocket = (userId?: string) => {
  const socketRef = useRef<ClientSocket | null>(null);
  const listenersRef = useRef<Set<Listener>>(new Set());

  useEffect(() => {
    if (!userId) return;

    const socket = createSocket(BASE_URL, {
      transports: ['polling', 'websocket'],
      auth: {token: Cookies.get('access_token')},
      // transportOptions: {
      //   withCredentials: true,
      // },
    });

    socket.on('connect', () => console.log('✅ connected', socket.id));
    socket.on('connect_error', (e: Error) => console.log('❌ connect_error', e?.message));
    socket.on('error', (e: Error) => console.log('⛔ server-error', e?.message));
    socketRef.current = socket;

    socket.on('chatMessage', (msg: Message) => {
      listenersRef.current.forEach(fn => fn(msg));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const joinChat = useCallback((chatId: string) => {
    socketRef.current?.emit('joinChat', {chatId});
  }, []);

  const sendMessage = useCallback((chatId: string, content: string) => {
    socketRef.current?.emit('chatMessage', {chatId, content});
  }, []);

  const subscribe = useCallback((fn: Listener) => {
    listenersRef.current.add(fn);
    return () => {
      listenersRef.current.delete(fn);
    };
  }, []);

  return {joinChat, sendMessage, subscribe};
};
