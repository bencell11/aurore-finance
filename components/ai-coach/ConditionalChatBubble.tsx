'use client';

import { usePathname } from 'next/navigation';
import ChatBubble from './ChatBubble';

export default function ConditionalChatBubble() {
  const pathname = usePathname();
  
  // Ne pas afficher la bulle sur la landing page
  if (pathname === '/') {
    return null;
  }
  
  return <ChatBubble />;
}