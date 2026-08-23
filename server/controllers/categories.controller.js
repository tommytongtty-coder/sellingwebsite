import * as categoriesService from '../services/categories.service';

export async function getAll(req, res, next) {
  try {
    const categories = await categoriesService.getAllCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}
