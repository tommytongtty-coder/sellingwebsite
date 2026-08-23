import * as listingsRepository from '../repositories/listings.repository';

export async function getAllListings() {
  return listingsRepository.findAll();
}
