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
  const [currentProperty, setCurrentProperty] = useState(null);
  const [currentOtherUser, setCurrentOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConversations, setShowConversations] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageContainerRef = useRef(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Use this to track window width for responsive design
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const isMobile = windowWidth < 768;

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
      // On mobile, hide conversations list when a conversation is selected
      if (isMobile) {
        setShowConversations(false);
      }
    }
  }, [selectedConversation, isMobile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add scroll event listener to show/hide the scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (messageContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
        // Show button when scrolled up from bottom
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 300);
      }
    };

    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      messageContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (messageContainer) {
        messageContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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
<<<<<<< HEAD
      // Handle the new response structure
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
        setCurrentProperty(response.data.property);
        setCurrentOtherUser(response.data.other_user);
      } else {
        // Fallback for backward compatibility
        setMessages(response.data);
=======
      console.log('Messages response:', response.data);
      
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.error('Invalid messages response format:', response.data);
        setMessages([]);
>>>>>>> message-fix
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
        receiver_id: currentOtherUser?.user_id || selectedConversation.other_user.user_id,
        property_id: currentProperty?.property_id || selectedConversation.property_id,
        content: newMessage
      });

      // Handle the new response structure
      if (response.data && response.data.sender) {
        setMessages([...messages, response.data]);
      } else {
        // If we get back just the message object directly
        setMessages([...messages, response.data]);
      }
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

<<<<<<< HEAD
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.other_user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.property.property_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Make sure we're properly tracking selectedConversation properly
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    if (isMobile) {
      setShowConversations(false);
    }
  };
=======
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
>>>>>>> message-fix

  if (loading) return <Spinner />;

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden">
          <div className="grid grid-cols-12 h-[calc(100vh-180px)] md:h-[calc(100vh-220px)]">
            {/* Conversations List */}
            {(showConversations || !selectedConversation || !isMobile) && (
              <div className="col-span-12 md:col-span-3 lg:col-span-3 border-r border-gray-200">
                <div className="p-4 md:p-5 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 truncate">{t('conversations')}</h2>
                    {selectedConversation && isMobile && (
                      <button 
                        onClick={() => setShowConversations(false)}
                        className="p-1 rounded-full bg-gray-200 text-gray-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="mt-3 relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('searchConversations')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-y-auto custom-scrollbar h-[calc(100%-6rem)]">
                  {filteredConversations.length === 0 ? (
                    <div className="p-5 text-center text-gray-500">
                      {searchTerm ? t('noConversationsFound') : t('noConversations')}
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.conversation_id}
                        className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                          selectedConversation?.conversation_id === conv.conversation_id
                            ? 'bg-primary/5 border-l-4 border-l-primary'
                            : ''
                        }`}
                        onClick={() => handleSelectConversation(conv)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={conv.other_user.picture || 'https://via.placeholder.com/40'}
                              alt={conv.other_user.name}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400"></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">{conv.other_user.name}</h3>
                            <p className="text-sm text-gray-500 truncate">
                              {conv.property.property_name}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400 flex-shrink-0">
                            {conv.last_message_time && format(new Date(conv.last_message_time), 'MMM d')}
                          </div>
=======
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
>>>>>>> message-fix
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">{t('noMessages') || 'No messages yet'}</p>
                      </div>
<<<<<<< HEAD
                    ))
                  )}
=======
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
>>>>>>> message-fix
                </div>
              </div>
            )}

            {/* Messages Area */}
            {(!showConversations || !selectedConversation || !isMobile) && (
              <div className={`col-span-12 ${showConversations && !isMobile ? 'md:col-span-9 lg:col-span-9' : ''} flex flex-col bg-gray-50 h-full`}>
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 bg-white">
                      <div className="flex items-center gap-2 md:gap-4">
                        <button
                          onClick={() => setIsMobileSidebarOpen(true)}
                          className="md:hidden p-1 rounded-full hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                        </button>
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="relative">
                            <img 
                              src={selectedConversation.other_user.picture || '/placeholder-avatar.png'} 
                              alt={selectedConversation.other_user.name} 
                              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
                            />
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border border-white"></span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm md:text-base line-clamp-1">{selectedConversation.other_user.name}</span>
                            <span className="text-gray-500 text-xs line-clamp-1">{t('online')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div 
                      ref={messageContainerRef}
                      className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4 bg-[url('/patterns/chat-bg.png')] bg-opacity-5 relative"
                    >
                      {showScrollButton && (
                        <button 
                          onClick={scrollToBottom}
                          className="absolute bottom-6 right-6 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors z-20"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <p>{t('startConversation')}</p>
                        </div>
                      ) : (
                        <>
                          <div className="text-center text-xs text-gray-500 py-2 rounded-full bg-gray-100/50 backdrop-blur-sm sticky top-0 z-10 mb-6">
                            {messages.length > 0 && format(new Date(messages[0].created_at), 'MMMM d, yyyy')}
                          </div>
                          <div className="space-y-6 md:space-y-8">
                            {messages.map((message, index) => {
                              const isSender = message.sender_id === user.user_id;
                              const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
                              
                              // Check if we need to show a date separator
                              const showDateSeparator = index > 0 && 
                                new Date(message.created_at).toDateString() !== 
                                new Date(messages[index - 1].created_at).toDateString();
                              
                              return (
                                <React.Fragment key={message.message_id}>
                                  {showDateSeparator && (
                                    <div className="text-center text-xs text-gray-500 py-2 rounded-full bg-gray-100/50 backdrop-blur-sm my-6">
                                      {format(new Date(message.created_at), 'MMMM d, yyyy')}
                                    </div>
                                  )}
                                  <div 
                                    className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}
                                    ref={index === messages.length - 1 ? messagesEndRef : null}
                                  >
                                    {!isSender && showAvatar && (
                                      <img
                                        src={selectedConversation.other_user.picture || '/placeholder-avatar.png'}
                                        alt={selectedConversation.other_user.name}
                                        className="h-8 w-8 md:h-10 md:w-10 rounded-full mr-2 mt-1 flex-shrink-0"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = 'https://via.placeholder.com/32';
                                        }}
                                      />
                                    )}
                                    <div
                                      className={`relative max-w-[75%] md:max-w-[70%] p-3 rounded-lg ${
                                        isSender
                                          ? 'bg-primary text-white rounded-tr-none'
                                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                      }`}
                                    >
                                      <p className="text-sm md:text-base whitespace-pre-wrap break-words">{message.content}</p>
                                      <div className="flex justify-end items-center mt-1 gap-1">
                                        <span className="text-xs opacity-70">
                                          {format(new Date(message.created_at), 'p')}
                                        </span>
                                        {isSender && (
                                          <span>
                                            {message.is_read ? (
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 12.586l7.293-7.293a1 1 0 011.414 1.414l-8 8z" />
                                              </svg>
                                            ) : (
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 12.586l7.293-7.293a1 1 0 011.414 1.414l-8 8z" />
                                              </svg>
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {isSender && showAvatar && (
                                      <img
                                        src={user.picture || '/placeholder-avatar.png'}
                                        alt={user.name}
                                        className="h-8 w-8 md:h-10 md:w-10 rounded-full ml-2 mt-1 flex-shrink-0"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = 'https://via.placeholder.com/32';
                                        }}
                                      />
                                    )}
                                  </div>
                                </React.Fragment>
                              );
                            })}
                          </div>
                          <div ref={messagesEndRef} className="h-4" /> {/* Extra space at the bottom */}
                        </>
                      )}
                    </div>

                    {/* Message Input */}
                    <form onSubmit={sendMessage} className="p-2 md:p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex-shrink-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex-shrink-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={t('typeMessage')}
                            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-primary text-white rounded-full p-2 md:p-3 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                          disabled={!newMessage.trim()}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center">
                    <div className="w-32 h-32 md:w-64 md:h-64 mb-6">
                      <img
                        src="/images/empty-messages.svg"
                        alt="No conversation selected"
                        className="w-full h-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{t('noConversationSelected')}</h3>
                    <p className="text-gray-500 max-w-md">
                      {t('selectConversationDescription')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
