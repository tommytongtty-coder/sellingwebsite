import * as listingsRepository from '../repositories/listings.repository';

export async function getAllListings(filters) {
  return listingsRepository.findAll(filters);
}

export async function getListingById(id) {
  return listingsRepository.findById(id);
}

export async function createListing(data) {
  return listingsRepository.create(data);
}

export async function updateListing(id, data) {
  return listingsRepository.update(id, data);
}

export async function incrementViews(id) {
  return listingsRepository.incrementViews(id);
}
