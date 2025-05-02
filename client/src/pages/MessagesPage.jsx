import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks';
import { useLanguage } from '@/providers/LanguageProvider';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';

const MessagesPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
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
    if (location.state?.conversationId && conversations.length > 0) {
      const conversation = conversations.find(
        conv => conv.conversation_id === location.state.conversationId
      );
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [location.state, conversations]);

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
      console.log('Fetching conversations for user:', user?.user_id, 'Role:', user?.role);
      const response = await axiosInstance.get('/messages/conversations');
      console.log('Conversations response:', response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        setConversations(response.data);
        // Auto-select the first conversation if none is selected
        if (!selectedConversation && response.data.length > 0) {
          setSelectedConversation(response.data[0]);
        }
      } else {
        console.log('No conversations found or empty array returned');
        setConversations([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      console.log('Fetching messages for conversation:', conversationId);
      const response = await axiosInstance.get(`/messages/${conversationId}`);
      console.log('Messages response:', response.data);
      
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.error('Invalid messages response format:', response.data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      setMessages([]);
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

  // Display a message if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Please log in to view messages</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to access your messages.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('messages') || 'Messages'}</h1>
          <p className="text-gray-600">
            {user?.role === 'tenant' || user?.role === 1 
              ? (t('tenantMessagesDescription') || 'View and respond to your conversations with property owners')
              : (t('ownerMessagesDescription') || 'View and respond to inquiries from potential tenants')}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">{t('conversations')}</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
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
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {t('noConversations') || 'No conversations yet'}
                  </div>
                )}
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
                    {messages.length > 0 ? (
                      messages.map((message) => (
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
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">{t('noMessages') || 'No messages yet'}</p>
                      </div>
                    )}
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
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">{t('selectConversation') || 'Select a conversation to start messaging'}</p>
                  <p className="text-gray-400 text-sm text-center max-w-md">
                    {conversations.length === 0 
                      ? (t('noConversationsYet') || 'You don\'t have any conversations yet. When tenants contact you about your properties, they will appear here.')
                      : (t('selectFromLeft') || 'Please select a conversation from the list on the left to view messages.')}
                  </p>
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
