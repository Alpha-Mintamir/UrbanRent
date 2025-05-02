const Message = require('../models/Message');
const User = require('../models/User');
const Property = require('../models/Place');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
<<<<<<< HEAD
    // Log the user object to debug
    console.log('User object in getConversations:', req.user);
    
    // Get user ID from token, handling different token structures
    let userId;
    if (req.user.id) {
      userId = req.user.id;
    } else if (req.user.user_id) {
      userId = req.user.user_id;
    } else {
      // Try to extract from token as a fallback
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token in getConversations:', decoded);
        userId = decoded.id || decoded.user_id;
      } catch (error) {
        console.error('Error decoding token in getConversations:', error);
        return res.status(401).json({ message: 'Authentication failed' });
      }
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    console.log('Using user ID for conversations:', userId);

    // Find all messages where the user is either sender or receiver
    const messages = await Message.findAll({
=======
    const userId = req.user.user_id;
    console.log('Getting conversations for user ID:', userId, 'Role:', req.user.role);

    // First, get all unique conversation IDs for this user
    const userMessages = await Message.findAll({
>>>>>>> message-fix
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
<<<<<<< HEAD
      include: [
        {
          model: Property,
          attributes: ['property_name', 'price']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Group messages by conversation_id
    const conversationMap = new Map();
    
    for (const message of messages) {
      if (!conversationMap.has(message.conversation_id)) {
        // Get the other user ID (the one that's not the current user)
        const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        
        try {
          // Get the other user's details
          const otherUser = await User.findByPk(otherUserId, {
            attributes: ['user_id', 'name', 'picture']
          });
          
          if (!otherUser) {
            console.error(`User not found with ID: ${otherUserId}`);
            continue; // Skip this conversation if user not found
          }
          
          // Count unread messages
          const unreadCount = await Message.count({
            where: {
              conversation_id: message.conversation_id,
=======
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
>>>>>>> message-fix
              receiver_id: userId,
              is_read: false
            }
          });
<<<<<<< HEAD
          
          // Add to conversation map
          conversationMap.set(message.conversation_id, {
            conversation_id: message.conversation_id,
            property_id: message.property_id,
            property: message.Property,
            other_user: otherUser,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: unreadCount
          });
        } catch (error) {
          console.error(`Error processing conversation ${message.conversation_id}:`, error);
          // Continue to next conversation instead of failing the entire request
        }
      }
    }
    
    // Convert map to array
    const conversationsWithDetails = Array.from(conversationMap.values());
    
    console.log(`Found ${conversationsWithDetails.length} conversations for user ${userId}`);
    
    res.json(conversationsWithDetails);
=======

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
>>>>>>> message-fix
  } catch (error) {
    console.error('Error getting conversations:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      user: req.user
    });
    res.status(500).json({ message: 'Error getting conversations' });
  }
};

// Get messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Log the user object to debug
    console.log('User object in getMessages:', req.user);
    
    // Get user ID from token, handling different token structures
    let userId;
    if (req.user.id) {
      userId = req.user.id;
    } else if (req.user.user_id) {
      userId = req.user.user_id;
    } else {
      // Try to extract from token as a fallback
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token in getMessages:', decoded);
        userId = decoded.id || decoded.user_id;
      } catch (error) {
        console.error('Error decoding token in getMessages:', error);
        return res.status(401).json({ message: 'Authentication failed' });
      }
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    console.log(`Getting messages for conversation ${conversationId} for user ${userId}`);

    // Verify the user is part of this conversation
    const conversationExists = await Message.findOne({
      where: {
        conversation_id: conversationId,
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      }
    });

    if (!conversationExists) {
      return res.status(403).json({ message: 'You do not have access to this conversation' });
    }

    // Get all messages for this conversation
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

    // Mark messages as read if the user is the receiver
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

    // Get property details
    const propertyId = conversationExists.property_id;
    const property = await Property.findByPk(propertyId, {
      attributes: ['property_id', 'property_name', 'price']
    });

    // Get the other user in the conversation
    const otherUserId = conversationExists.sender_id === userId 
      ? conversationExists.receiver_id 
      : conversationExists.sender_id;
    
    const otherUser = await User.findByPk(otherUserId, {
      attributes: ['user_id', 'name', 'picture']
    });

    res.json({
      messages,
      property,
      other_user: otherUser
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      conversationId: req.params.conversationId,
      user: req.user
    });
    res.status(500).json({ message: 'Error getting messages' });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { conversation_id, receiver_id, property_id, content } = req.body;
    
    // Log the user object to debug
    console.log('User object in sendMessage:', req.user);
    
    // Get user ID from token, handling different token structures
    let sender_id;
    if (req.user.id) {
      sender_id = req.user.id;
    } else if (req.user.user_id) {
      sender_id = req.user.user_id;
    } else {
      // Try to extract from token as a fallback
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token in sendMessage:', decoded);
        sender_id = decoded.id || decoded.user_id;
      } catch (error) {
        console.error('Error decoding token in sendMessage:', error);
        return res.status(401).json({ message: 'Authentication failed' });
      }
    }
    
    if (!sender_id) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    console.log('Using sender ID for message:', sender_id);

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
    
    // Log the entire user object to see what's available
    console.log('User object from token:', req.user);
    
    // Try to get sender_id from various possible locations in the token
    let sender_id = null;
    if (req.user && req.user.id) {
      sender_id = req.user.id;
    } else if (req.user && req.user.user_id) {
      sender_id = req.user.user_id;
    } else if (req.user) {
      // If we have a user object but no id field, log it for debugging
      console.log('User object exists but has no id field:', req.user);
      
      // As a fallback, try to extract user_id from the token directly
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        sender_id = decoded.id || decoded.user_id;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

<<<<<<< HEAD
    console.log('Starting conversation with:', { 
      sender_id, 
      receiver_id, 
      property_id, 
      property_id_type: typeof property_id,
      content
    });

    // Verify sender exists and is a tenant or admin
    if (!sender_id) {
      return res.status(400).json({ 
        message: 'Unable to identify sender from authentication token' 
      });
    }

    // Verify sender is a tenant or admin
    if (req.user && req.user.role !== 1 && req.user.role !== 4) {
=======
    // Log the user information for debugging
    console.log('User in startConversation:', req.user);
    console.log('User role type:', typeof req.user.role, 'Value:', req.user.role);
    
    // Verify sender is a tenant (role can be string 'tenant' or integer 1)
    // Convert role to string for comparison if it's a number
    const userRole = req.user.role;
    const isTenant = userRole === 'tenant' || userRole === 1 || String(userRole) === '1';
    
    if (!isTenant) {
      console.log('User role check failed:', userRole);
>>>>>>> message-fix
      return res.status(403).json({ 
        message: 'Only tenants can initiate new conversations' 
      });
    }
    console.log('User role check passed:', userRole);

<<<<<<< HEAD
    // Convert property_id to integer if it's a string
    let propertyIdInt = property_id;
    if (typeof property_id === 'string') {
      propertyIdInt = parseInt(property_id, 10);
      if (isNaN(propertyIdInt)) {
        return res.status(400).json({
          message: 'Invalid property ID format. Expected an integer.'
        });
      }
=======
    // Verify receiver exists and is a property owner (role 2) or broker (role 3)
    const receiver = await User.findByPk(receiver_id);
    console.log('Receiver found:', receiver ? 'yes' : 'no', 'Role:', receiver?.role);
    
    if (!receiver) {
      return res.status(400).json({ 
        message: 'Receiver not found' 
      });
>>>>>>> message-fix
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
<<<<<<< HEAD
        property_id: propertyIdInt
=======
        property_id
>>>>>>> message-fix
      }
    });

    console.log('Property found:', property ? 'yes' : 'no', 'ID:', property_id);
    
    if (!property) {
      console.error(`Property not found with ID: ${propertyIdInt}`);
      return res.status(400).json({ 
<<<<<<< HEAD
        message: 'Invalid property. Property not found.' 
=======
        message: 'Property not found' 
>>>>>>> message-fix
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
      property_id: propertyIdInt,
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
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      user: req.user
    });
    
    // Send a more specific error message if possible
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'Invalid reference: One of the IDs provided does not exist in the database.' 
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error: ' + error.message 
      });
    }
    
    res.status(500).json({ message: 'Error starting conversation' });
  }
}; 