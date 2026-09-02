import * as usersRepository from '../repositories/users.repository';

export async function getCurrentUser(userId) {
  return usersRepository.findById(userId);
}

export async function getPublicProfile(userId) {
  return usersRepository.getProfile(userId);
}

export async function getUserListings(userId) {
  return usersRepository.getUserListings(userId);
}

export async function getUserFavorites(userId) {
  return usersRepository.getUserFavorites(userId);
}

export async function getUserOffers(userId) {
  return usersRepository.getUserOffers(userId);
}
