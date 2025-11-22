import { useEffect, useState } from 'react';

export type Message = { role: 'user' | 'assistant'; content: string };

type ChatWidgetProps = {
  title?: string;
  placeholder?: string;
  system?: string;
  initialMessages?: Message[];
  model?: string;
};

export default function ChatWidget({
  title = 'Ask Pathfinder',
  placeholder = 'Ask about local pathways…',
  system,
  initialMessages = [],
  model = 'gpt-4o-mini',
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If initialMessages change (rare), sync them
    setMessages(initialMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages?.length]);

  const send = async () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: 'user', content: input.trim() } as Message];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, system, model }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const reply = (data?.reply as string) || '';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setError(e?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="w-full max-w-md border rounded-lg p-3 text-sm">
      <div className="mb-2 font-medium">{title}</div>
      <div className="h-48 overflow-auto bg-gray-50 rounded p-2 mb-2 space-y-2">
        {messages.length === 0 && (
          <div className="text-gray-500">Try: “Which UH programs align with marine robotics?”</div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={
              'inline-block px-2 py-1 rounded ' +
              (m.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-white border')
            }>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-500">Thinking…</div>}
        {error && <div className="text-red-600">{error}</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
        />
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={send}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
