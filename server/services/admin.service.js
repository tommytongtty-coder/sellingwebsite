import * as adminRepository from '../repositories/admin.repository';
import * as conversationsRepository from '../repositories/conversations.repository';

export async function getAllListings() {
  return adminRepository.getAllListings();
}

export async function getListingById(id) {
  return adminRepository.getListingById(id);
}

export async function updateListing(id, data, adminId) {
  return adminRepository.updateListing(id, data, adminId);
}

export async function approveListing(id, adminId) {
  return adminRepository.approveListing(id, adminId);
}

export async function rejectListing(id, adminId) {
  return adminRepository.rejectListing(id, adminId);
}

export async function getLogs() {
  return adminRepository.getLogs();
}

export async function getConversations() {
  return adminRepository.getConversations();
}

// Opens the admin support thread for a listing, or returns the existing one.
// seller_id is read from the listing rather than taken from the request, and
// the thread is left empty so the admin writes the first message.
export async function openListingThread(listingId, adminId) {
  const listing = await adminRepository.getListingById(listingId);
  if (!listing) {
    const err = new Error('Listing not found');
    err.status = 404;
    throw err;
  }
  if (listing.seller_id === adminId) {
    const err = new Error('Cannot open a support thread with yourself');
    err.status = 400;
    throw err;
  }
  return conversationsRepository.create({
    listing_id: listing.id,
    buyer_id: adminId,
    seller_id: listing.seller_id,
    type: 'admin_support',
  });
}
