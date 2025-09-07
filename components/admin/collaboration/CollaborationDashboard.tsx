
import React, { useState, useEffect, useRef } from 'react';
import { User, CollaborationChannel, ChannelMessage } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

interface CollaborationDashboardProps {
    user: User;
    channels: CollaborationChannel[];
    messages: ChannelMessage[];
    onAddMessage: (channelId: string, text: string) => void;
    selectedChannelId: string | null;
    onSelectChannel: (channelId: string | null) => void;
}

const CollaborationDashboard: React.FC<CollaborationDashboardProps> = ({
    user,
    channels,
    messages,
    onAddMessage,
    selectedChannelId,
    onSelectChannel
}) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const selectedChannel = channels.find(c => c.id === selectedChannelId);
    
    const channelMessages = messages
        .filter(m => m.channelId === selectedChannelId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [channelMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChannelId) return;
        onAddMessage(selectedChannelId, newMessage);
        setNewMessage('');
    };

    const sortedChannels = [...channels].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-5rem)]">
            {/* Channel List */}
            <Card className="w-full md:w-1/3 p-0 flex flex-col">
                <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">업무 채널 목록</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{channels.length}개 채널</p>
                </header>
                <div className="flex-1 overflow-y-auto">
                    {sortedChannels.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => onSelectChannel(channel.id)}
                            className={`w-full text-left p-4 border-b dark:border-gray-700 transition-colors ${
                                selectedChannelId === channel.id
                                    ? 'bg-green-100 dark:bg-green-900/50'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{channel.scholarshipTitle}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                생성일: {new Date(channel.createdAt).toLocaleDateString('ko-KR')}
                            </p>
                        </button>
                    ))}
                     {sortedChannels.length === 0 && <p className="text-center p-4 text-sm text-gray-500">생성된 채널이 없습니다.</p>}
                </div>
            </Card>

            {/* Chat View */}
            <Card className="w-full md:w-2/3 p-0 flex flex-col">
                {selectedChannel ? (
                    <>
                        <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedChannel.scholarshipTitle}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">업무 관련 소통 및 히스토리 관리</p>
                        </header>
                        <main ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                            {channelMessages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${msg.senderId === user.id ? 'justify-end' : ''}`}
                                >
                                    {msg.senderId !== user.id && (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-bold text-sm flex-shrink-0" title={msg.senderName}>
                                            {msg.senderName.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className={`max-w-md p-3 rounded-lg ${
                                            msg.senderId === user.id
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700'
                                        }`}>
                                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                        </div>
                                        <p className={`text-xs text-gray-400 mt-1 ${msg.senderId === user.id ? 'text-right' : ''}`}>
                                            {msg.senderName} • {new Date(msg.timestamp).toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </main>
                        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="메시지를 입력하세요..."
                                    className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                                />
                                <Button type="submit" variant="primary" disabled={!newMessage.trim()}>
                                    전송
                                </Button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">채널을 선택해주세요</h3>
                        <p className="text-gray-500 dark:text-gray-400">왼쪽 목록에서 채널을 선택하거나, 장학금 관리 화면에서 새로 생성하세요.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CollaborationDashboard;
