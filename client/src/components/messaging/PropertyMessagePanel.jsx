import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks';
import { useLanguage } from '@/providers/LanguageProvider';
import axiosInstance from '@/utils/axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Spinner from '@/components/ui/Spinner';

const PropertyMessagePanel = ({ propertyId, ownerId, ownerName }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user && propertyId && ownerId) {
      fetchConversation();
    } else {
      setLoading(false);
    }
  }, [user, propertyId, ownerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      // First check if a conversation already exists
      const conversationsResponse = await axiosInstance.get('/messages/conversations');
      const existingConversation = conversationsResponse.data.find(
        conv => conv.property_id === propertyId && 
               (conv.other_user.user_id === ownerId || 
                (conv.receiver_id === ownerId && conv.sender_id === user.user_id))
      );

      if (existingConversation) {
        setConversationId(existingConversation.conversation_id);
        await fetchMessages(existingConversation.conversation_id);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const response = await axiosInstance.get(`/messages/${convId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error(language === 'am' ? 'መልእክቶችን ማግኘት አልተቻለም' : 'Could not fetch messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log('Sending message with:', {
      conversationId,
      ownerId,
      propertyId,
      content: newMessage
    });

    setSending(true);
    try {
      if (conversationId) {
        // Send message in existing conversation
        console.log('Sending to existing conversation:', conversationId);
        const response = await axiosInstance.post('/messages', {
          conversation_id: conversationId,
          receiver_id: ownerId,
          property_id: propertyId,
          content: newMessage
        });

        console.log('Message sent successfully:', response.data);
        setMessages([...messages, response.data]);
      } else {
        // Start a new conversation
        console.log('Starting new conversation with owner:', ownerId);
        
        // Make sure we have valid IDs
        if (!ownerId || !propertyId) {
          console.error('Missing required IDs:', { ownerId, propertyId });
          throw new Error('Missing required information');
        }
        
        // Create a simple initial message
        const initialMessage = `Hi, I'm interested in your property. ${newMessage}`;
        
        try {
          const response = await axiosInstance.post('/messages/start', {
            receiver_id: parseInt(ownerId),
            property_id: parseInt(propertyId),
            content: initialMessage
          });

          console.log('New conversation started:', response.data);
          if (response.data && response.data.conversation_id) {
            setConversationId(response.data.conversation_id);
            setMessages([response.data]);
          } else {
            console.error('Invalid response data:', response.data);
            throw new Error('Invalid response from server');
          }
        } catch (innerError) {
          console.error('Error in conversation start:', innerError);
          throw innerError;
        }
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // More descriptive error message
      let errorMessage = language === 'am' ? 'መልእክት መላክ አልተቻለም' : 'Could not send message';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
        
        if (error.response.status === 401) {
          errorMessage = language === 'am' ? 'እባክዎ መጀመሪያ ይግቡ' : 'Please login first';
        } else if (error.response.status === 403) {
          errorMessage = language === 'am' ? 'ይህን ድርጊት ለማከናወን ፈቃድ የለዎትም' : 'You do not have permission to perform this action';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = language === 'am' ? 'ከሰርቨር ምላሽ አልተገኘም' : 'No response from server';
      }
      
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  // Don't render if user is not logged in
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">{language === 'am' ? 'ከባለንብረት ጋር ይገናኙ' : 'Contact Owner'}</h3>
        <p className="text-gray-600 mb-4">
          {language === 'am' 
            ? 'ከንብረት ባለቤቱ ጋር ለመነጋገር እባክዎ ይግቡ።' 
            : 'Please log in to message the property owner.'}
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors w-full"
        >
          {t('login') || 'Login'}
        </button>
      </div>
    );
  }

  // Don't render if user is the owner
  if (user.user_id === ownerId) {
    return null;
  }

  // Don't render for non-tenants
  if (user.role !== 'tenant' && user.role !== 1) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">{language === 'am' ? 'ከባለንብረት ጋር ይገናኙ' : 'Contact Owner'}</h3>
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">{language === 'am' ? 'ከባለንብረት ጋር ይገናኙ' : 'Contact Owner'}</h3>
      
      {/* Messages Container */}
      <div className="border rounded-lg mb-4 h-64 overflow-y-auto p-4 bg-gray-50">
        {messages.length > 0 ? (
          <div className="space-y-4">
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
                      : 'bg-gray-200'
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              {language === 'am' 
                ? `${ownerName} ጋር ይነጋገሩ`
                : `Start a conversation with ${ownerName}`}
            </p>
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={language === 'am' ? 'መልእክትዎን ይጻፉ...' : 'Type your message...'}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={sending}
        />
        <button
          type="submit"
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors disabled:opacity-50"
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {language === 'am' ? 'በመላክ ላይ...' : 'Sending...'}
            </span>
          ) : (
            language === 'am' ? 'ላክ' : 'Send'
          )}
        </button>
      </form>
    </div>
  );
};

export default PropertyMessagePanel;
