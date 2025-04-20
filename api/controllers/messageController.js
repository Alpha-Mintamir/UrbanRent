const Message = require('../models/Message');
const User = require('../models/User');
const Property = require('../models/Place');
const { Op } = require('sequelize');

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Find all unique conversations
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      attributes: ['conversation_id', 'property_id'],
      group: ['conversation_id', 'property_id'],
      include: [
        {
          model: Property,
          attributes: ['property_name', 'price']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Get the other user's information for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({
          where: { conversation_id: conv.conversation_id },
          order: [['created_at', 'DESC']]
        });

        const otherUserId = lastMessage.sender_id === userId 
          ? lastMessage.receiver_id 
          : lastMessage.sender_id;

        const otherUser = await User.findByPk(otherUserId, {
          attributes: ['user_id', 'name', 'picture']
        });

        return {
          conversation_id: conv.conversation_id,
          property_id: conv.property_id,
          property: conv.Property,
          other_user: otherUser,
          last_message: lastMessage.content,
          last_message_time: lastMessage.created_at,
          unread_count: await Message.count({
            where: {
              conversation_id: conv.conversation_id,
              receiver_id: userId,
              is_read: false
            }
          })
        };
      })
    );

    res.json(conversationsWithDetails);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ message: 'Error getting conversations' });
  }
};

// Get messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.user_id;

    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      order: [['created_at', 'ASC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'name', 'picture']
        }
      ]
    });

    // Mark messages as read
    await Message.update(
      { is_read: true },
      {
        where: {
          conversation_id: conversationId,
          receiver_id: userId,
          is_read: false
        }
      }
    );

    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error getting messages' });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { conversation_id, receiver_id, property_id, content } = req.body;
    const sender_id = req.user.user_id;

    const message = await Message.create({
      conversation_id,
      sender_id,
      receiver_id,
      property_id,
      content
    });

    const messageWithSender = await Message.findByPk(message.message_id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'name', 'picture']
        }
      ]
    });

    res.status(201).json(messageWithSender);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Start a new conversation
exports.startConversation = async (req, res) => {
  try {
    const { receiver_id, property_id, content } = req.body;
    const sender_id = req.user.user_id;

    // Create a new message with a new conversation_id
    const message = await Message.create({
      sender_id,
      receiver_id,
      property_id,
      content
    });

    const messageWithDetails = await Message.findByPk(message.message_id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'name', 'picture']
        },
        {
          model: Property,
          attributes: ['property_name', 'price']
        }
      ]
    });

    res.status(201).json(messageWithDetails);
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ message: 'Error starting conversation' });
  }
}; 