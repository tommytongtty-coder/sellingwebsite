import * as adminRepository from '../repositories/admin.repository';

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
