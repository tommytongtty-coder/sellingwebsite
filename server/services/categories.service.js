import * as categoriesRepository from '../repositories/categories.repository';

export async function getAllCategories() {
  return categoriesRepository.findAll();
}
