import * as conversationsRepository from '../repositories/conversations.repository';
import * as messagesRepository from '../repositories/messages.repository';
import * as usersRepository from '../repositories/users.repository';
import * as listingsRepository from '../repositories/listings.repository';

export async function getConversations(userId) {
  return conversationsRepository.findByUserId(userId);
}

export async function getConversationById(id) {
  return conversationsRepository.findById(id);
}

export async function createConversation({ listing_id, buyer_id, seller_id }) {
  return conversationsRepository.create({ listing_id, buyer_id, seller_id });
}

// Open or return an existing admin_support conversation for a listing
export async function openAdminChat(listingId, sellerId) {
  const listing = await listingsRepository.findById(listingId);
  if (!listing) {
    const err = new Error('Listing not found');
    err.status = 404;
    throw err;
  }
  if (listing.seller_id !== sellerId) {
    const err = new Error('You do not own this listing');
    err.status = 403;
    throw err;
  }
  const admin = await usersRepository.findAdmin();
  if (!admin) {
    const err = new Error('No admin user found');
    err.status = 500;
    throw err;
  }
  return conversationsRepository.create({
    listing_id: listing.id,
    buyer_id: admin.id,
    seller_id: sellerId,
    type: 'admin_support',
  });
}

// Open or return an existing admin_support conversation for a buyer on a listing
export async function openBuyerAdminChat(listingId, buyerId) {
  const listing = await listingsRepository.findById(listingId);
  if (!listing) {
    const err = new Error('Listing not found');
    err.status = 404;
    throw err;
  }
  const admin = await usersRepository.findAdmin();
  if (!admin) {
    const err = new Error('No admin user found');
    err.status = 500;
    throw err;
  }
  return conversationsRepository.create({
    listing_id: listing.id,
    buyer_id: buyerId,
    seller_id: admin.id,
    type: 'admin_support',
  });
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
