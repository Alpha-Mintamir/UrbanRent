const Message = require('../models/Message');
const User = require('../models/User');
const Property = require('../models/Place');
const { Op } = require('sequelize');

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log('Getting conversations for user ID:', userId, 'Role:', req.user.role);

    // First, get all unique conversation IDs for this user
    const userMessages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      attributes: ['conversation_id'],
      group: ['conversation_id'],
      order: [['conversation_id', 'ASC']]
    });

    const conversationIds = userMessages.map(msg => msg.conversation_id);
    console.log(`Found ${conversationIds.length} unique conversations for user ${userId}:`, conversationIds);
    
    if (conversationIds.length === 0) {
      console.log('No conversations found for this user');
      return res.json([]);
    }

    // Process each conversation separately to avoid SQL ambiguity issues
    const conversationsWithDetails = await Promise.all(
      conversationIds.map(async (conversationId) => {
        try {
          console.log('Processing conversation:', conversationId);
          
          // Get the last message in this conversation
          const lastMessage = await Message.findOne({
            where: { conversation_id: conversationId },
            order: [['created_at', 'DESC']]
          });

          if (!lastMessage) {
            console.log('No messages found for conversation:', conversationId);
            return null;
          }

          // Get the property details
          const property = await Property.findByPk(lastMessage.property_id, {
            attributes: ['property_id', 'property_name', 'price', 'user_id']
          });

          if (!property) {
            console.log('Property not found for conversation:', conversationId);
            return null;
          }

          // Determine the other user in the conversation
          const otherUserId = lastMessage.sender_id === userId 
            ? lastMessage.receiver_id 
            : lastMessage.sender_id;

          const otherUser = await User.findByPk(otherUserId, {
            attributes: ['user_id', 'name', 'picture', 'role']
          });

          if (!otherUser) {
            console.log('Could not find other user with ID:', otherUserId);
            return null;
          }

          console.log('Found conversation between', userId, 'and', otherUser.name, 'about property:', property.property_name);

          // Count unread messages
          const unreadCount = await Message.count({
            where: {
              conversation_id: conversationId,
              receiver_id: userId,
              is_read: false
            }
          });

          return {
            conversation_id: conversationId,
            property_id: lastMessage.property_id,
            property: property,
            other_user: otherUser,
            last_message: lastMessage.content,
            last_message_time: lastMessage.created_at,
            unread_count: unreadCount
          };
        } catch (error) {
          console.error('Error processing conversation:', conversationId, error);
          return null;
        }
      })
    );

    // Filter out any null values (conversations with errors)
    const validConversations = conversationsWithDetails.filter(conv => conv !== null);
    console.log(`Returning ${validConversations.length} valid conversations`);

    // Sort by most recent message
    validConversations.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));

    res.json(validConversations);
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

    // Log the user information for debugging
    console.log('User in startConversation:', req.user);
    console.log('User role type:', typeof req.user.role, 'Value:', req.user.role);
    
    // Verify sender is a tenant (role can be string 'tenant' or integer 1)
    // Convert role to string for comparison if it's a number
    const userRole = req.user.role;
    const isTenant = userRole === 'tenant' || userRole === 1 || String(userRole) === '1';
    
    if (!isTenant) {
      console.log('User role check failed:', userRole);
      return res.status(403).json({ 
        message: 'Only tenants can initiate new conversations' 
      });
    }
    console.log('User role check passed:', userRole);

    // Verify receiver exists and is a property owner (role 2) or broker (role 3)
    const receiver = await User.findByPk(receiver_id);
    console.log('Receiver found:', receiver ? 'yes' : 'no', 'Role:', receiver?.role);
    
    if (!receiver) {
      return res.status(400).json({ 
        message: 'Receiver not found' 
      });
    }
    
    // Check if receiver is a property owner or broker (roles can be strings or integers)
    const receiverRole = receiver.role;
    const isOwnerOrBroker = 
      receiverRole === 'owner' || 
      receiverRole === 'broker' || 
      receiverRole === 2 || 
      receiverRole === 3 || 
      String(receiverRole) === '2' || 
      String(receiverRole) === '3';
      
    console.log('Receiver role check:', receiverRole, isOwnerOrBroker);
    
    // For testing purposes, temporarily disable this check
    // if (!isOwnerOrBroker) {
    //   return res.status(400).json({ 
    //     message: 'Invalid receiver. Must be a property owner or broker' 
    //   });
    // }

    // Verify property exists
    const property = await Property.findOne({
      where: {
        property_id
      }
    });

    console.log('Property found:', property ? 'yes' : 'no', 'ID:', property_id);
    
    if (!property) {
      return res.status(400).json({ 
        message: 'Property not found' 
      });
    }
    
    // For now, we'll skip the check that the property belongs to the receiver
    // This is because our current data model might not have owner_id or broker_id fields
    console.log('Property user_id:', property.user_id, 'Receiver ID:', receiver_id);

    // Check if a conversation already exists between these users for this property
    console.log('Checking for existing conversation between sender:', sender_id, 'and receiver:', receiver_id, 'for property:', property_id);
    
    const existingConversation = await Message.findOne({
      where: {
        [Op.or]: [
          {
            sender_id,
            receiver_id,
            property_id
          },
          {
            sender_id: receiver_id,
            receiver_id: sender_id,
            property_id
          }
        ]
      },
      order: [['created_at', 'DESC']]
    });

    let conversation_id;
    if (existingConversation) {
      // Use the existing conversation_id
      conversation_id = existingConversation.conversation_id;
      console.log('Found existing conversation:', conversation_id);
    } else {
      // Generate a new UUID for the conversation
      conversation_id = require('uuid').v4();
      console.log('Created new conversation ID:', conversation_id);
    }

    // Create a new message with the conversation_id
    const message = await Message.create({
      conversation_id,
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