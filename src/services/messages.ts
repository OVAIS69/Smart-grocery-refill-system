import { Message, MessageThread, User, UserRole } from '@/types';

const THREADS_KEY = 'sg_message_threads';
const MESSAGES_KEY = 'sg_messages';
const CHANNEL_NAME = 'sg-message-channel';

const defaultThreads: MessageThread[] = [
  {
    id: 'thread-manager-2-supplier-3',
    managerId: 2,
    managerName: 'Manager User',
    supplierId: 3,
    supplierName: 'Supplier User',
    topic: 'General supply',
    createdAt: new Date().toISOString(),
  },
];

const safeParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error('Failed to parse messaging storage', error);
    return fallback;
  }
};

const persist = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage({ type: 'sync' });
  channel.close();
};

const findThread = (threads: MessageThread[], threadId: string) =>
  threads.find((thread) => thread.id === threadId);

const generateId = () => crypto.randomUUID?.() ?? `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const messageService = {
  getThreads(): MessageThread[] {
    const storedThreads = safeParse<MessageThread[]>(localStorage.getItem(THREADS_KEY), []);
    if (storedThreads.length === 0) {
      persist(THREADS_KEY, defaultThreads);
      return defaultThreads;
    }
    return storedThreads;
  },

  getMessages(threadId?: string): Message[] {
    const messages = safeParse<Message[]>(localStorage.getItem(MESSAGES_KEY), []);
    return threadId ? messages.filter((msg) => msg.threadId === threadId) : messages;
  },

  sendMessage(params: { threadId: string; body: string; from: User }): Message | null {
    const threads = this.getThreads();
    const thread = findThread(threads, params.threadId);
    if (!thread || !params.body.trim()) return null;

    const messages = this.getMessages();
    const toRole: UserRole =
      params.from.role === 'manager'
        ? 'supplier'
        : params.from.role === 'supplier'
          ? 'manager'
          : 'manager';

    const toUserId =
      params.from.role === 'manager'
        ? thread.supplierId
        : params.from.role === 'supplier'
          ? thread.managerId
          : thread.managerId;

    const newMessage: Message = {
      id: generateId(),
      threadId: params.threadId,
      fromUserId: params.from.id,
      fromRole: params.from.role,
      toUserId,
      toRole,
      body: params.body.trim(),
      createdAt: new Date().toISOString(),
      readBy: [params.from.id],
    };

    const updated = [...messages, newMessage];
    persist(MESSAGES_KEY, updated);
    return newMessage;
  },

  markThreadRead(threadId: string, userId: number) {
    const messages = this.getMessages();
    const updated = messages.map((msg) =>
      msg.threadId === threadId && !msg.readBy.includes(userId)
        ? { ...msg, readBy: [...msg.readBy, userId] }
        : msg
    );
    persist(MESSAGES_KEY, updated);
  },

  touchStorage() {
    // Force sync for listeners without data changes
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: 'sync' });
    channel.close();
  },

  subscribe(callback: () => void): () => void {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const handler = () => callback();
    channel.addEventListener('message', handler);
    const storageHandler = (event: StorageEvent) => {
      if (event.key === THREADS_KEY || event.key === MESSAGES_KEY) {
        callback();
      }
    };
    window.addEventListener('storage', storageHandler);

    return () => {
      channel.removeEventListener('message', handler);
      channel.close();
      window.removeEventListener('storage', storageHandler);
    };
  },
};


