
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from '../../ui/Card';
import { ADMIN_MANUAL_DATA, ManualEntry } from './adminManualData';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  sources?: ManualEntry[];
}

const AdminChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        text: '안녕하세요. AI 업무 매뉴얼 어시스턴트입니다. 장학금 관리, 신청서 처리, RPA 도구 사용법 등 어떤 업무에 대해 궁금하신가요?',
        sender: 'bot',
      },
    ]);
  }, []);

  const findRelevantManualEntries = (query: string): ManualEntry[] => {
    const queryLower = query.toLowerCase();
    const queryWords = new Set(queryLower.split(/\s+/).filter(w => w.length > 1));
    if (queryWords.size === 0) return [];

    const scoredEntries = ADMIN_MANUAL_DATA.map(entry => {
      let score = 0;
      const content = `${entry.question} ${entry.keywords.join(' ')}`.toLowerCase();
      queryWords.forEach(word => {
        if (content.includes(word)) {
          score++;
        }
      });
      return { entry, score };
    });

    return scoredEntries
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.entry)
      .slice(0, 3); 
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const relevantManuals = findRelevantManualEntries(inputValue);
    
    const ragPrompt = `You are an AI assistant for university staff, providing answers based on an internal administrative manual. Use the provided context to answer the user's question accurately.

CONTEXT:
---
${relevantManuals.map(m => `Q: ${m.question}\nA: ${m.answer}`).join('\n---\n')}
---

QUESTION:
${inputValue}

Based *only* on the context provided, answer the user's question in Korean. If the context does not contain the answer, state that the information is not in the manual and you cannot answer.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: ragPrompt,
        });
        
        const botMessage: ChatMessage = {
            id: Date.now().toString() + '-bot',
            text: response.text,
            sender: 'bot',
            sources: relevantManuals,
        };
        setMessages(prev => [...prev, botMessage]);

    } catch (error) {
        console.error("Gemini API call failed:", error);
        const errorMessage: ChatMessage = {
            id: Date.now().toString() + '-bot',
            text: '죄송합니다, 답변을 생성하는 중 오류가 발생했습니다.',
            sender: 'bot',
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="p-0 flex flex-col h-[calc(100vh-4rem)]">
        <header className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI 업무 매뉴얼 챗봇</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">관리자 업무에 대해 질문하면 AI가 매뉴얼을 기반으로 답변합니다.</p>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>}
                    <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'bot' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-green-600 text-white'}`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                                <h4 className="text-xs font-semibold mb-1">참고 매뉴얼</h4>
                                <ul className="space-y-1">
                                    {msg.sources.map(source => <li key={source.id} className="text-xs opacity-80">{source.question}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">...</div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </main>
        
        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="업무 관련 질문을 입력하세요..."
                    className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    disabled={isLoading}
                />
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md disabled:bg-green-400" disabled={isLoading || !inputValue.trim()}>
                    전송
                </button>
            </form>
        </footer>
    </Card>
  );
};

export default AdminChatInterface;
