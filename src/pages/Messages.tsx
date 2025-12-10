import { FormEvent, useMemo, useState } from 'react';
import { PaperAirplaneIcon, EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useMessaging } from '@/hooks/useMessaging';
import { formatRelativeTime } from '@/utils/date';

export const Messages = () => {
  const { threads, activeThreadId, setActiveThreadId, messages, sendMessage, getUnreadCount, getCounterpartyName, isSending, currentUser } =
    useMessaging();
  const [draft, setDraft] = useState('');

  const activeThread = useMemo(() => threads.find((t) => t.id === activeThreadId) ?? null, [activeThreadId, threads]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft.trim());
    setDraft('');
  };

  const renderMessageBubble = (body: string) => {
    const parts = body.split('\n').filter((line) => line.trim() !== '');
    return (
      <div className="space-y-1">
        {parts.map((line, idx) => (
          <p key={idx} className="text-sm text-slate-800 whitespace-pre-wrap">
            {line}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Messaging</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Manager ↔ Supplier chat</h1>
          <p className="text-slate-600 mt-2">
            Real-time, local-only messaging. Admins can see every conversation.
          </p>
        </div>
      </div>

      {!currentUser && (
        <div className="card bg-white shadow-lg border-2 border-primary-100 p-6">
          <p className="text-slate-700">Please sign in to use messaging.</p>
        </div>
      )}

      {currentUser && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 card bg-white shadow-lg border-2 border-primary-100 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-primary-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Threads</h2>
                <p className="text-xs text-slate-500">
                  {currentUser.role === 'admin' ? 'Viewing all conversations' : 'You can chat with your counterpart'}
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 capitalize">
                {currentUser.role}
              </span>
            </div>
            <div className="divide-y divide-primary-50 max-h-[70vh] overflow-y-auto">
              {threads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                const unread = getUnreadCount(thread.id);
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left px-5 py-4 transition-all ${
                      isActive ? 'bg-primary-50/70 border-l-4 border-primary-500' : 'hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{getCounterpartyName(thread)}</p>
                        <p className="text-xs text-slate-500">{thread.topic || 'General'}</p>
                      </div>
                      {unread > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2 rounded-full bg-primary-600 text-white text-xs font-bold">
                          {unread}
                        </span>
                      )}
                    </div>
                    {thread.lastMessage && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{thread.lastMessage.body}</p>
                    )}
                    {thread.lastMessage && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        {formatRelativeTime(thread.lastMessage.createdAt)}
                      </p>
                    )}
                  </button>
                );
              })}
              {threads.length === 0 && (
                <div className="p-5 text-sm text-slate-600">No threads available for this role.</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 card bg-white shadow-lg border-2 border-primary-100 rounded-2xl flex flex-col min-h-[70vh]">
            {activeThread ? (
              <>
                <div className="p-5 border-b border-primary-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Conversation</p>
                    <h3 className="text-xl font-semibold text-slate-900">{getCounterpartyName(activeThread)}</h3>
                    <p className="text-xs text-slate-500">{activeThread.topic || 'General supply'}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <EyeIcon className="h-5 w-5 text-primary-500" />
                    <span>Admin can view</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-primary-50/40 to-white">
                  {messages.length === 0 && (
                    <div className="text-center text-slate-500 text-sm py-10">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isMine = currentUser?.id === msg.fromUserId;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm border ${
                            isMine
                              ? 'bg-primary-600 text-white border-primary-500'
                              : 'bg-white text-slate-900 border-primary-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold capitalize">
                              {msg.fromRole}
                              {isMine ? ' (you)' : ''}
                            </p>
                            <p className={`text-[11px] ${isMine ? 'text-white/80' : 'text-slate-500'}`}>
                              {formatRelativeTime(msg.createdAt)}
                            </p>
                          </div>
                          <div className="mt-2">{renderMessageBubble(msg.body)}</div>
                          <div className="mt-2 flex items-center gap-1 text-[11px]">
                            {isMine ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                            <span className={isMine ? 'text-white/80' : 'text-slate-500'}>
                              {isMine ? 'Sent' : 'Received'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSubmit} className="p-5 border-t border-primary-100 bg-white">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-2xl border-2 border-primary-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 px-4 py-3 text-sm resize-none"
                      rows={3}
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || isSending}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary-600 text-white px-4 py-3 text-sm font-semibold shadow-lg hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-600 text-sm p-10">
                Select a thread to start chatting.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


