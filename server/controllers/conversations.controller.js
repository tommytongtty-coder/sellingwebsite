import * as conversationsService from '../services/conversations.service';

export async function getConversations(req, res, next) {
  try {
    const conversations = await conversationsService.getConversations(req.auth.id);
    res.json(conversations);
  } catch (err) {
    next(err);
  }
}

export async function createConversation(req, res, next) {
  try {
    const { listing_id, seller_id } = req.body;
    const conversation = await conversationsService.createConversation({
      listing_id,
      buyer_id: req.auth.id,
      seller_id,
    });
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const conversation = await conversationsService.getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    if (conversation.buyer_id !== req.auth.id && conversation.seller_id !== req.auth.id) {
      return res.status(403).json({ error: 'Not a participant in this conversation' });
    }
    const messages = await conversationsService.getMessages(req.params.id);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const conversation = await conversationsService.getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    if (conversation.buyer_id !== req.auth.id && conversation.seller_id !== req.auth.id) {
      return res.status(403).json({ error: 'Not a participant in this conversation' });
    }
    const message = await conversationsService.sendMessage({
      conversation_id: req.params.id,
      sender_id: req.auth.id,
      body: req.body.body,
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const conversation = await conversationsService.getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    if (conversation.buyer_id !== req.auth.id && conversation.seller_id !== req.auth.id) {
      return res.status(403).json({ error: 'Not a participant in this conversation' });
    }
    await conversationsService.markAsRead(req.params.id, req.auth.id);
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    next(err);
  }
}
