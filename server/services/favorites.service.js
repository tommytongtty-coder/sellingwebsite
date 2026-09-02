import * as favoritesRepository from '../repositories/favorites.repository';

export async function getFavorites(userId) {
  return favoritesRepository.findByUserId(userId);
}

export async function addFavorite(userId, listingId) {
  return favoritesRepository.create(userId, listingId);
}

export async function removeFavorite(userId, listingId) {
  return favoritesRepository.remove(userId, listingId);
}

export async function isFavorited(userId, listingId) {
  return favoritesRepository.isFavorited(userId, listingId);
}
