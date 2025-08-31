import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, ChatMessage, DiagnosticAnswers, AllScholarships, ScoredScholarship } from '../../types';
import { DIAGNOSTIC_QUESTIONS } from '../../constants';
import { getChatbotResponse } from '../../services/geminiService';
import Message from './Message';
import DiagnosticFlow from './DiagnosticFlow';
import { scoreScholarships } from '../../utils/scoring';

interface ChatInterfaceProps {
  user: User;
  initialPrompt?: string | null;
  onPromptConsumed?: () => void;
  // FIX: Changed to accept all scholarships to enable diagnostics on the full dataset.
  allScholarships: AllScholarships[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, initialPrompt, onPromptConsumed, allScholarships }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const loadingMessageId = `loading-${Date.now()}`;
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      sender: 'bot',
      isLoading: true,
      text: loadingText, // Initial loading text
    };
    setMessages(prev => [...prev, loadingMessage]);

    const onStatusUpdate = (status: string) => {
      setLoadingText(status);
      setMessages(prev => prev.map(m => 
        m.id === loadingMessageId ? { ...m, text: status } : m
      ));
    };
    
    const internalScholarships = allScholarships.filter(s => s.source === 'Internal');
    const ragResponse = await getChatbotResponse(messageText, internalScholarships, onStatusUpdate);

    const botMessage: ChatMessage = {
      id: Date.now().toString() + '-bot',
      text: ragResponse.answer,
      sources: ragResponse.sources,
      sender: 'bot',
    };
    
    setMessages(prev => prev.filter(m => m.id !== loadingMessageId));
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
    setLoadingText('답변을 생성 중입니다...'); // Reset for next time
  }, [isLoading, loadingText, allScholarships]);

  useEffect(() => {
    if (initialPrompt && !isLoading) {
      handleSendMessage(initialPrompt);
      if(onPromptConsumed) onPromptConsumed();
    }
  }, [initialPrompt, isLoading, handleSendMessage, onPromptConsumed]);


  const startDiagnosis = useCallback(() => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: '맞춤 장학금 추천을 위한 자가진단을 시작하겠습니다. 몇 가지 질문에 답변해주세요.',
      },
    ]);
    setIsDiagnosing(true);
  }, []);

  useEffect(() => {
    if (messages.length > 0) return; // Prevent welcome message from re-appearing
    const welcomeMessage: ChatMessage = {
      id: 'welcome-1',
      sender: 'bot',
      text: `안녕하세요, ${user.name}님! AI 장학 도우미입니다.\n대시보드에서 국가장학금 정보를 바로 확인하거나, 궁금한 점을 질문해보세요.`,
      actions: [{ text: '맞춤 장학금 찾기 (자가진단)', handler: startDiagnosis }],
    };
    setMessages([welcomeMessage]);
  }, [messages.length, startDiagnosis, user.name]);
  
  const handleDiagnosticComplete = (answers: DiagnosticAnswers) => {
    setIsDiagnosing(false);
    
    // FIX: `allScholarships` is now passed as a prop and can be used for scoring.
    const allReqBasedScholarships = allScholarships.filter(s => s.requirements);

    const scored = scoreScholarships(answers, allReqBasedScholarships);

    const recommendationMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: '진단 결과를 바탕으로 다음과 같은 장학금을 추천해 드립니다.',
      recommendations: scored,
    };

    setMessages(prev => [...prev, recommendationMessage]);
  };

  return (
    <div className="flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg h-[85vh] max-h-[85vh]">
       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">AI 챗봇 상담</h3>
       </div>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6">
          {messages.map(msg => (
            <Message key={msg.id} message={msg} user={user} />
          ))}
          {isDiagnosing && (
            <DiagnosticFlow
              questions={DIAGNOSTIC_QUESTIONS}
              onComplete={handleDiagnosticComplete}
              user={user}
            />
          )}
        </div>
        <div ref={messagesEndRef} />
      </main>
      {!isDiagnosing && (
        <footer className="border-t border-gray-200 dark:border-gray-700 p-4">
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
              placeholder="질문을 입력하세요..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 bg-gray-50 dark:bg-gray-700"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-700 text-white rounded-full p-3 hover:bg-blue-800 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor" transform="rotate(90)">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </footer>
      )}
    </div>
  );
};

export default ChatInterface;