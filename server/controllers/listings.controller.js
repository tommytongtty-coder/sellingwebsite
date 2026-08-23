import * as listingsService from '../services/listings.service';

export async function getAll(req, res, next) {
  try {
    const listings = await listingsService.getAllListings();
    res.json(listings);
  } catch (err) {
    next(err);
  }
}
