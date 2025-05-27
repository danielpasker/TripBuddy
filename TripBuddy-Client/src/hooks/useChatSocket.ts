import {useCallback, useEffect, useRef, useState} from 'react';
import {Socket} from 'socket.io-client';
import io from 'socket.io-client';
import {Message} from '@customTypes/Message';

export const useChatSocket = (currentUserId?: string) => {
  const socketRef = useRef<typeof Socket>();

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!currentUserId) {
      console.warn('No current user ID provided for chat socket');
      return;
    }
    socketRef.current = io(import.meta.env.VITE_API_BASE_URL as string, {
      auth: {userId: currentUserId},
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => setConnected(true));
    socketRef.current.on('disconnect', () => setConnected(false));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentUserId]);

  const sendMessage = useCallback((to: string, text: string) => {
    socketRef.current?.emit('private-message', {to, text});
  }, []);

  const subscribe = useCallback((handler: (m: Message) => void) => {
    socketRef.current?.on('private-message', handler);
    return () => socketRef.current?.off('private-message', handler);
  }, []);

  return {connected, sendMessage, subscribe, socket: socketRef.current};
};
