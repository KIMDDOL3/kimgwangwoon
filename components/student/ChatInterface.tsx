import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, ChatMessage, DiagnosticAnswers, AllScholarships } from '../../types';
import { DIAGNOSTIC_QUESTIONS } from '../../constants';
import { getChatbotResponse } from '../../services/geminiService';
import Message from './Message';
import DiagnosticFlow from './DiagnosticFlow';
import { scoreScholarships } from '../../utils/scoring';
import Card from '../ui/Card';

interface ChatInterfaceProps {
  user: User;
  initialPrompt?: string | null;
  onPromptConsumed?: () => void;
  allScholarships: AllScholarships[];
  initialMessages: ChatMessage[];
  onSaveHistory: (newHistory: ChatMessage[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, initialPrompt, onPromptConsumed, allScholarships, initialMessages, onSaveHistory }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('답변을 생성 중입니다...');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
    };
    
    const messagesWithUser = [...messages, userMessage];
    setMessages(messagesWithUser);
    setInputValue('');
    setIsLoading(true);

    const loadingMessageId = `loading-${Date.now()}`;
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      sender: 'bot',
      isLoading: true,
      text: loadingText,
    };
    setMessages(prev => [...prev, loadingMessage]);

    const onStatusUpdate = (status: string) => {
      setMessages(prev => prev.map(m => 
        m.id === loadingMessageId ? { ...m, text: status } : m
      ));
    };
    
    const internalScholarships = allScholarships.filter(s => s.source === 'Internal');
    const ragResponse = await getChatbotResponse(messageText, messagesWithUser, internalScholarships, onStatusUpdate);

    const botMessage: ChatMessage = {
      id: Date.now().toString() + '-bot',
      text: ragResponse.answer,
      sources: ragResponse.sources,
      sender: 'bot',
    };
    
    setMessages(prev => {
        const finalMessages = [...prev.filter(m => m.id !== loadingMessageId), botMessage];
        onSaveHistory(finalMessages);
        return finalMessages;
    });
    
    setIsLoading(false);
    setLoadingText('답변을 생성 중입니다...');
  }, [isLoading, loadingText, allScholarships, messages, onSaveHistory]);

  useEffect(() => {
    if (initialPrompt && !isLoading) {
      handleSendMessage(initialPrompt);
      if(onPromptConsumed) onPromptConsumed();
    }
  }, [initialPrompt, isLoading, handleSendMessage, onPromptConsumed]);

  const startDiagnosis = useCallback(() => {
    // FIX: Explicitly typed the new message object to prevent TypeScript from inferring 'sender' as a generic string.
    const botMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        text: '맞춤 장학금 추천을 위한 자가진단을 시작하겠습니다. 몇 가지 질문에 답변해주세요.',
    };
    setMessages(prevMessages => {
        const newMessages = [
            ...prevMessages,
            botMessage,
        ];
        onSaveHistory(newMessages);
        return newMessages;
    });
    setIsDiagnosing(true);
  }, [onSaveHistory]);

  const handleDiagnosisComplete = useCallback((answers: DiagnosticAnswers) => {
    setIsDiagnosing(false);
    const internalScholarships = allScholarships.filter(s => s.source === 'Internal' && s.requirements);
    const recommendations = scoreScholarships(answers, internalScholarships);
    
    const botMessage: ChatMessage = recommendations.length > 0
      ? {
        id: Date.now().toString(),
        sender: 'bot',
        text: `진단 결과를 바탕으로 ${user.name}님에게 가장 적합한 장학금을 추천해 드립니다.`,
        recommendations: recommendations.slice(0, 3),
      } : {
        id: Date.now().toString(),
        sender: 'bot',
        text: '아쉽지만, 현재 조건에 맞는 맞춤 장학금을 찾지 못했습니다. 다른 조건으로 다시 시도해보시거나, 전체 장학금 목록을 확인해보세요.',
      };

    setMessages(prev => {
        const finalMessages = [...prev, botMessage];
        onSaveHistory(finalMessages);
        return finalMessages;
    });
  }, [user.name, allScholarships, onSaveHistory]);


  useEffect(() => {
    if (initialMessages.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: 'welcome-1',
          sender: 'bot',
          text: `안녕하세요, ${user.name}님! AI 장학 도우미입니다.\n대시보드에서 국가장학금 정보를 바로 확인하거나, 궁금한 점을 질문해보세요.`,
          actions: [{ text: '맞춤 장학금 찾기 (자가진단)', handler: startDiagnosis }],
        };
        const newHistory = [welcomeMessage];
        setMessages(newHistory);
        onSaveHistory(newHistory);
    }
  }, []); // Intentionally empty to run only once on mount if history is empty

  return (
    <Card className="p-0">
      <div className="flex flex-col h-[85vh] max-h-[85vh]">
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                AI
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI 장학 도우미</h3>
                <p className="text-base text-gray-500 dark:text-gray-400">무엇이든 물어보세요</p>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="space-y-6">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} user={user} />
            ))}
            {isDiagnosing && (
              <DiagnosticFlow
                questions={DIAGNOSTIC_QUESTIONS}
                onComplete={handleDiagnosisComplete}
                user={user}
              />
            )}
          </div>
          <div ref={messagesEndRef} />
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isDiagnosing ? "진단이 진행 중입니다..." : "장학금에 대해 질문해보세요..."}
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-100 dark:bg-gray-700"
              disabled={isLoading || isDiagnosing}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim() || isDiagnosing}
              className="bg-green-700 text-white rounded-full p-3 hover:bg-green-800 disabled:bg-green-400 dark:disabled:bg-green-800 disabled:cursor-not-allowed transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor" transform="rotate(90)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </footer>
      </div>
    </Card>
  );
};

export default ChatInterface;