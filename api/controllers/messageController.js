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

    // Verify user is part of the conversation
    const isParticipant = await Message.findOne({
      where: {
        conversation_id: conversationId,
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      }
    });

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

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

    // Verify the conversation exists and user is part of it
    const existingMessage = await Message.findOne({
      where: {
        conversation_id,
        [Op.or]: [
          { sender_id: sender_id },
          { receiver_id: sender_id }
        ]
      }
    });

    if (!existingMessage) {
      return res.status(403).json({ message: 'Not authorized to send message in this conversation' });
    }

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

    // Verify sender is a tenant
    if (req.user.role !== 'tenant') {
      return res.status(403).json({ 
        message: 'Only tenants can initiate new conversations' 
      });
    }

    // Verify receiver exists and is a property owner or broker
    const receiver = await User.findByPk(receiver_id);
    if (!receiver || !['owner', 'broker'].includes(receiver.role)) {
      return res.status(400).json({ 
        message: 'Invalid receiver. Must be a property owner or broker' 
      });
    }

    // Verify property exists and belongs to receiver
    const property = await Property.findOne({
      where: {
        property_id,
        [Op.or]: [
          { owner_id: receiver_id },
          { broker_id: receiver_id }
        ]
      }
    });

    if (!property) {
      return res.status(400).json({ 
        message: 'Invalid property. Must belong to the receiver' 
      });
    }

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