import * as offersRepository from '../repositories/offers.repository';

export async function getOffersForListing(listingId) {
  return offersRepository.findByListingId(listingId);
}

export async function getOffersByBuyer(buyerId) {
  return offersRepository.findByBuyerId(buyerId);
}

export async function getOfferById(id) {
  return offersRepository.findById(id);
}

export async function getLatestOffer(listingId) {
  return offersRepository.findLatestByListingId(listingId);
}

export async function createOffer({ listing_id, buyer_id, offered_by, amount, message }) {
  return offersRepository.create({ listing_id, buyer_id, offered_by, amount, message });
}

export async function updateOfferStatus(id, status) {
  return offersRepository.updateStatus(id, status);
}

export async function acceptOffer(id) {
  return offersRepository.updateStatus(id, 'accepted');
}

export async function rejectOffer(id) {
  return offersRepository.updateStatus(id, 'rejected');
}

export async function counterOffer(originalOfferId, userId, amount, message) {
  const original = await offersRepository.findById(originalOfferId);
  if (!original) {
    const err = new Error('Offer not found');
    err.status = 404;
    throw err;
  }
  // Mark the original offer as countered
  await offersRepository.updateStatus(originalOfferId, 'countered');
  // Create a new offer from the counter party
  return offersRepository.create({
    listing_id: original.listing_id,
    buyer_id: original.buyer_id,
    offered_by: userId,
    amount,
    message,
  });
}
