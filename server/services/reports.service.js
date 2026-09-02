import * as reportsRepository from '../repositories/reports.repository';

export async function getAll() {
  return reportsRepository.findAll();
}

export async function getById(id) {
  return reportsRepository.findById(id);
}

export async function create({ reporter_id, target_listing_id, target_user_id, reason }) {
  return reportsRepository.create({ reporter_id, target_listing_id, target_user_id, reason });
}

export async function updateStatus(id, status) {
  return reportsRepository.updateStatus(id, status);
}
