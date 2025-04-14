import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import AccountNav from '@/components/ui/AccountNav';
import Spinner from '@/components/ui/Spinner';
import { useLanguage } from '@/providers/LanguageProvider';

const MessagesPage = () => {
  const { language, t } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // This is a placeholder - you'll need to implement the API endpoint
        const { data } = await axiosInstance.get('/messages/conversations');
        setConversations(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // If the API doesn't exist yet, just show empty state
        setConversations([]);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          // This is a placeholder - you'll need to implement the API endpoint
          const { data } = await axiosInstance.get(`/messages/${selectedConversation.id}`);
          setMessages(data || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      // This is a placeholder - you'll need to implement the API endpoint
      await axiosInstance.post('/messages/send', {
        conversationId: selectedConversation.id,
        content: newMessage
      });

      // Add the message to the UI immediately
      setMessages([
        ...messages,
        {
          id: Date.now(), // Temporary ID
          content: newMessage,
          sender: 'owner',
          createdAt: new Date().toISOString()
        }
      ]);
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="px-4 pt-20">
      <AccountNav />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('messages')}</h1>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h2 className="text-2xl font-semibold mb-2">{t('noMessages')}</h2>
            <p className="text-gray-600 mb-6">
              {t('noMessagesDescription')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-semibold">{t('messageConversations')}</h2>
              </div>
              <div className="overflow-y-auto h-[calc(600px-57px)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-50'
                        : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {conversation.guestName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {conversation.guestName}
                        </p>
                        <p className="text-gray-500 text-sm">{t('customer')}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="ml-2 bg-[#D746B7] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {selectedConversation.guestName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-semibold">
                          {selectedConversation.guestName}
                        </h2>
                        <p className="text-gray-500 text-xs">
                          {selectedConversation.propertyName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 my-10">
                        {t('startConversation')}
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`max-w-[80%] ${
                            message.sender === 'owner'
                              ? 'ml-auto bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                              : 'bg-gray-200 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                          } p-3`}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'owner'
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t flex"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t('sendMessage')}
                      className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-[#D746B7] text-white px-4 py-2 rounded-r-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {t('selectConversation')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
