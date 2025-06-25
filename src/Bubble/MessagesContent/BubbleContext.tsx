import React from 'react';
import { MessageBubbleData } from '../type';

export const MessagesContext = React.createContext<{
  setMessage: (message: Partial<MessageBubbleData>) => void;
  message?: MessageBubbleData;
  hidePadding?: boolean;
  setHidePadding?: (hide: boolean) => void;
}>({
  setMessage: () => {},
  message: {} as MessageBubbleData,
  hidePadding: false,
  setHidePadding: () => {},
});
