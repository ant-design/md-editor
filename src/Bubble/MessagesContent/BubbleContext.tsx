import React from 'react';
import { MessageBubbleData } from '../type';

export const MessagesContext = React.createContext<{
  setMessage?: (message: Partial<MessageBubbleData>) => void;
  message?: MessageBubbleData;
  hidePadding?: boolean;
  setHidePadding?: (hide: boolean) => void;
  preMessageSameRole?: boolean;
  typing?: boolean;
}>({
  setMessage: () => {},
  message: {} as MessageBubbleData,
  hidePadding: false,
  setHidePadding: () => {},
  preMessageSameRole: false,
  typing: false,
});
