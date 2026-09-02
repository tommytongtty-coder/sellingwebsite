import * as conversationsRepository from '../repositories/conversations.repository';
import * as messagesRepository from '../repositories/messages.repository';

export async function getConversations(userId) {
  return conversationsRepository.findByUserId(userId);
}

export async function getConversationById(id) {
  return conversationsRepository.findById(id);
}

export async function createConversation({ listing_id, buyer_id, seller_id }) {
  return conversationsRepository.create({ listing_id, buyer_id, seller_id });
}

export async function getMessages(conversationId) {
  return messagesRepository.findByConversationId(conversationId);
}

export async function sendMessage({ conversation_id, sender_id, body }) {
  return messagesRepository.create({ conversation_id, sender_id, body });
}

export async function markAsRead(conversationId, userId) {
  return messagesRepository.markAsRead(conversationId, userId);
}
