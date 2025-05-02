import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { useLanguage } from '@/providers/LanguageProvider';
import axiosInstance from '@/utils/axios';
import { toast } from 'react-toastify';

const MessageButton = ({ propertyId, ownerId, ownerName }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    console.log('MessageButton props:', { propertyId, ownerId, ownerName });
    console.log('Current user:', user);

    // Check if we should render the button
    if (!user) {
      console.log('Not rendering MessageButton: User not logged in');
      setShouldRender(false);
      return;
    }

    // Check if user is a tenant (role 1)
    if (user.role !== 'tenant' && user.role !== 1) {
      console.log('Not rendering MessageButton: User is not a tenant', user.role);
      setShouldRender(false);
      return;
    }

    // Check if user is trying to message themselves
    if (user.user_id === ownerId) {
      console.log('Not rendering MessageButton: User is trying to message themselves');
      setShouldRender(false);
      return;
    }

    // Check if ownerId is valid
    if (!ownerId) {
      console.log('Not rendering MessageButton: Owner ID is missing');
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
  }, [user, ownerId, propertyId]);

  // Don't render if conditions aren't met
  if (!shouldRender) {
    return null;
  }

  const handleMessageClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      // First check if a conversation already exists
      const conversationsResponse = await axiosInstance.get('/messages/conversations');
      const existingConversation = conversationsResponse.data.find(
        conv => conv.property_id === propertyId && 
               (conv.other_user.user_id === ownerId || 
                (conv.receiver_id === ownerId && conv.sender_id === user.user_id))
      );

      if (existingConversation) {
        // If conversation exists, navigate to it
        navigate('/tenant/messages', {
          state: { conversationId: existingConversation.conversation_id }
        });
      } else {
        // Start a new conversation
        const response = await axiosInstance.post('/messages/start', {
          receiver_id: ownerId,
          property_id: propertyId,
          content: t('initialMessage', { propertyOwner: ownerName }) || `Hi, I'm interested in your property.`
        });

        // Navigate to messages page with the new conversation selected
        navigate('/tenant/messages', {
          state: { conversationId: response.data.conversation_id }
        });
      }
    } catch (error) {
      console.error('Error with messaging:', error);
      toast.error(t('errorStartingConversation') || 'Error starting conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleMessageClick}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
          clipRule="evenodd"
        />
      </svg>
      {isLoading ? t('sending') : t('messageOwner')}
    </button>
  );
};

export default MessageButton;