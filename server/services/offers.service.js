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

export async function createOffer({ listing_id, buyer_id, amount, message }) {
  return offersRepository.create({ listing_id, buyer_id, amount, message });
}

export async function updateOfferStatus(id, status) {
  return offersRepository.updateStatus(id, status);
}
