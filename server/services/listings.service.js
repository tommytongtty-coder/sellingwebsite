import * as listingsRepository from '../repositories/listings.repository';
import * as conversationsRepository from '../repositories/conversations.repository';
import * as messagesRepository from '../repositories/messages.repository';
import * as usersRepository from '../repositories/users.repository';

const VALID_CONDITIONS = ['new', 'like_new', 'used', 'open_box'];

const SELLER_GREETING = 'Hi, I want to sell this product';

function validateListingData(data) {
  const errors = [];

  if (!data.title || !data.title.trim()) {
    errors.push('Title is required');
  } else if (data.title.trim().length > 255) {
    errors.push('Title must be 255 characters or fewer');
  }

  if (data.price === undefined || data.price === null || data.price === '') {
    errors.push('Price is required');
  } else {
    const numPrice = Number(data.price);
    if (isNaN(numPrice) || numPrice < 0) {
      errors.push('Price must be a non-negative number');
    }
  }

  if (data.condition && !VALID_CONDITIONS.includes(data.condition)) {
    errors.push(`Condition must be one of: ${VALID_CONDITIONS.join(', ')}`);
  }

  if (data.vram_gb !== undefined && data.vram_gb !== null && data.vram_gb !== '') {
    const vram = Number(data.vram_gb);
    if (isNaN(vram) || vram < 1 || vram > 255) {
      errors.push('VRAM must be between 1 and 255 GB');
    }
  }

  if (data.quantity !== undefined && data.quantity !== null) {
    const qty = Number(data.quantity);
    if (isNaN(qty) || qty < 1 || qty > 255) {
      errors.push('Quantity must be between 1 and 255');
    }
  }

  return errors;
}

// Statuses the public feed is allowed to expose. Drafts are other people's
// unfinished listings, pending ones are awaiting moderation and rejected ones
// were refused, so none of them belong on the storefront.
const PUBLIC_STATUSES = ['active', 'sold'];

export async function getAllListings(filters = {}) {
  const requested = PUBLIC_STATUSES.includes(filters.status) ? filters.status : 'active';
  return listingsRepository.findAll({ ...filters, status: requested });
}

export async function getListingById(id) {
  return listingsRepository.findById(id);
}

// Creates a listing in draft status for the draft-to-pending workflow.
// After images are uploaded, call publishListing to move it to pending.
export async function createListing(data) {
  const errors = validateListingData(data);
  if (errors.length > 0) {
    const err = new Error(errors.join('; '));
    err.status = 400;
    throw err;
  }

  // Sellers cannot set status, is_certified, or views directly
  const safeData = { ...data };
  safeData.status = 'draft';
  delete safeData.is_certified;
  delete safeData.views;

  return listingsRepository.create(safeData);
}

// Moves a draft listing to pending for moderation and opens the seller's
// support thread with the shop admin.
//
// The thread is created *before* the status change so that a failure here
// leaves the listing as a retryable draft rather than a published listing
// with no conversation attached.
export async function publishListing(id, sellerId) {
  const listing = await listingsRepository.findById(id);
  if (!listing) {
    const err = new Error('Listing not found');
    err.status = 404;
    throw err;
  }
  if (listing.seller_id !== sellerId) {
    const err = new Error('Not authorized');
    err.status = 403;
    throw err;
  }
  if (listing.status !== 'draft') {
    const err = new Error('Only draft listings can be published');
    err.status = 400;
    throw err;
  }

  const conversation = await openAdminThread(listing, sellerId);
  const updated = await listingsRepository.update(id, { status: 'pending' });
  return { ...updated, conversation_id: conversation ? conversation.id : null };
}

// Opens (or reuses) the admin support thread for a listing and seeds it with
// the seller's greeting. Returns null when there is no admin to talk to, or
// when the seller is the admin.
async function openAdminThread(listing, sellerId) {
  const admin = await usersRepository.findAdmin();
  if (!admin || admin.id === sellerId) return null;

  const conversation = await conversationsRepository.create({
    listing_id: listing.id,
    buyer_id: admin.id,
    seller_id: sellerId,
    type: 'admin_support',
  });

  // Only seed the greeting on a freshly opened thread
  const existing = await messagesRepository.findByConversationId(conversation.id);
  if (existing.length === 0) {
    await messagesRepository.create({
      conversation_id: conversation.id,
      sender_id: sellerId,
      body: SELLER_GREETING,
    });
  }

  return conversation;
}

// Deletes a draft listing (used for cleanup on failed image upload)
export async function deleteDraftListing(id, sellerId) {
  const listing = await listingsRepository.findById(id);
  if (!listing) return;
  if (listing.seller_id !== sellerId) return;
  if (listing.status !== 'draft') return;
  await listingsRepository.deleteById(id);
}

export async function updateListing(id, data) {
  // Prevent sellers from changing moderation-controlled fields
  const safeData = { ...data };
  delete safeData.status;
  delete safeData.is_certified;
  delete safeData.views;
  delete safeData.seller_id;

  return listingsRepository.update(id, safeData);
}

export async function incrementViews(id) {
  return listingsRepository.incrementViews(id);
}
