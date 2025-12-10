import { useCallback, useEffect, useMemo, useState } from 'react';
import { messageService } from '@/services/messages';
import type { Message, MessageThread } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface ThreadWithLast extends MessageThread {
  lastMessage?: Message;
}

export const useMessaging = () => {
  const { user } = useAuthStore();
  const [threads, setThreads] = useState<MessageThread[]>(() => messageService.getThreads());
  const [messages, setMessages] = useState<Message[]>(() => messageService.getMessages());
  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => threads[0]?.id ?? null);
  const [isSending, setIsSending] = useState(false);

  const sync = useCallback(() => {
    setThreads(messageService.getThreads());
    setMessages(messageService.getMessages());
  }, []);

  useEffect(() => {
    sync();
    const unsubscribe = messageService.subscribe(sync);
    return () => unsubscribe();
  }, [sync]);

  useEffect(() => {
    if (!activeThreadId && threads.length > 0) {
      setActiveThreadId(threads[0].id);
    }
  }, [activeThreadId, threads]);

  const activeMessages = useMemo(() => {
    if (!activeThreadId) return [];
    return messages
      .filter((msg) => msg.threadId === activeThreadId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [activeThreadId, messages]);

  const getUnreadCount = useCallback(
    (threadId: string) => {
      if (!user) return 0;
      return messages.filter((msg) => msg.threadId === threadId && !msg.readBy.includes(user.id)).length;
    },
    [messages, user]
  );

  const markThreadRead = useCallback(
    (threadId: string) => {
      if (!user) return;
      messageService.markThreadRead(threadId, user.id);
      sync();
    },
    [sync, user]
  );

  useEffect(() => {
    if (activeThreadId) {
      markThreadRead(activeThreadId);
    }
  }, [activeThreadId, markThreadRead]);

  const threadsWithLastMessage = useMemo<ThreadWithLast[]>(() => {
    return threads
      .map((thread) => {
        const threadMessages = messages
          .filter((msg) => msg.threadId === thread.id)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return {
          ...thread,
          lastMessage: threadMessages[threadMessages.length - 1],
        };
      })
      .sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [messages, threads]);

  const sendMessage = useCallback(
    async (body: string) => {
      if (!user || !activeThreadId || !body.trim() || isSending) return;
      setIsSending(true);
      messageService.sendMessage({ threadId: activeThreadId, body, from: user });
      sync();
      setIsSending(false);
      markThreadRead(activeThreadId);
    },
    [activeThreadId, isSending, markThreadRead, sync, user]
  );

  const getCounterpartyName = useCallback(
    (thread: MessageThread) => {
      if (!user) return `${thread.managerName} ↔ ${thread.supplierName}`;
      if (user.role === 'manager') return thread.supplierName;
      if (user.role === 'supplier') return thread.managerName;
      return `${thread.managerName} ↔ ${thread.supplierName}`;
    },
    [user]
  );

  const currentUser = user;

  return {
    threads: threadsWithLastMessage,
    activeThreadId,
    setActiveThreadId,
    messages: activeMessages,
    sendMessage,
    getUnreadCount,
    getCounterpartyName,
    isSending,
    currentUser,
  };
};


