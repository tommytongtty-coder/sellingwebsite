import * as favoritesService from '../services/favorites.service';

export async function getFavorites(req, res, next) {
  try {
    const favorites = await favoritesService.getFavorites(req.auth.id);
    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

export async function addFavorite(req, res, next) {
  try {
    await favoritesService.addFavorite(req.auth.id, req.body.listing_id);
    res.status(201).json({ message: 'Favorite added' });
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    await favoritesService.removeFavorite(req.auth.id, req.params.listingId);
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    next(err);
  }
}
