import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { useLanguage } from '@/providers/LanguageProvider';
import axiosInstance from '@/utils/axios';

const MessageButton = ({ propertyId, ownerId, ownerName }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      // Start a new conversation
      const response = await axiosInstance.post('/messages/start', {
        receiver_id: ownerId,
        property_id: propertyId,
        content: t('initialMessage', { propertyOwner: ownerName })
      });

      // Navigate to messages page with the new conversation selected
      navigate('/tenant/messages', {
        state: { conversationId: response.data.conversation_id }
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      // You might want to show a toast notification here
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