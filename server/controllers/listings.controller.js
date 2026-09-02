import * as listingsService from '../services/listings.service';
import * as listingImagesRepository from '../repositories/listing_images.repository';

export async function getAll(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      condition: req.query.condition,
      location: req.query.location,
      category_id: req.query.category_id,
    };
    const listings = await listingsService.getAllListings(filters);
    res.json(listings);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const listing = await listingsService.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    await listingsService.incrementViews(req.params.id);
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = { ...req.body, seller_id: req.auth.id };
    const listing = await listingsService.createListing(data);
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const existing = await listingsService.getListingById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (existing.seller_id !== req.auth.id && req.auth.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const listing = await listingsService.updateListing(req.params.id, req.body);
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function uploadImages(req, res, next) {
  try {
    const listingId = req.params.id;
    const existing = await listingsService.getListingById(listingId);
    if (!existing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (existing.seller_id !== req.auth.id && req.auth.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const images = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const imageUrl = `/uploads/${file.filename}`;
      const isCover = i === 0 && (!existing.images || existing.images.length === 0);
      const image = await listingImagesRepository.create(listingId, imageUrl, i, isCover);
      images.push(image);
    }
    res.status(201).json(images);
  } catch (err) {
    next(err);
  }
}
