import React from 'react';
import { ChatMessage } from '../type';

export const MessagesContext = React.createContext<{
  setMessage: (message: Partial<ChatMessage>) => void;
  message?: ChatMessage;
  hidePadding?: boolean;
  setHidePadding?: (hide: boolean) => void;
}>({
  setMessage: () => {},
  message: {} as ChatMessage,
  hidePadding: false,
  setHidePadding: () => {},
});
