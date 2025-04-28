import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks';
import { useLanguage } from '@/providers/LanguageProvider';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import { format } from 'date-fns';

const MessagesPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.conversation_id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get('/messages/conversations');
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axiosInstance.get(`/messages/${conversationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axiosInstance.post('/messages', {
        conversation_id: selectedConversation.conversation_id,
        receiver_id: selectedConversation.other_user.user_id,
        property_id: selectedConversation.property_id,
        content: newMessage
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">{t('conversations')}</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                {conversations.map((conv) => (
                  <div
                    key={conv.conversation_id}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.conversation_id === conv.conversation_id
                        ? 'bg-gray-100'
                        : ''
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={conv.other_user.picture}
                        alt={conv.other_user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium">{conv.other_user.name}</h3>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.property.property_name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="col-span-8 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedConversation.other_user.picture}
                        alt={selectedConversation.other_user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium">
                          {selectedConversation.other_user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.property.property_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.message_id}
                        className={`flex ${
                          message.sender_id === user.user_id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender_id === user.user_id
                              ? 'bg-primary text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender_id === user.user_id
                                ? 'text-gray-200'
                                : 'text-gray-500'
                            }`}
                          >
                            {format(new Date(message.created_at), 'p')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('typeMessage')}
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="bg-primary text-white rounded-full px-6 py-2 hover:bg-primary-dark transition-colors"
                        disabled={!newMessage.trim()}
                      >
                        {t('send')}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">{t('selectConversation')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
