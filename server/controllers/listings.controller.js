import fs from 'fs';
import path from 'path';
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

// Creates a listing in draft status (step 1 of the draft-to-pending workflow)
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

// Moves a draft listing to pending (step 3 of the draft-to-pending workflow)
export async function publish(req, res, next) {
  try {
    const listing = await listingsService.publishListing(req.params.id, req.auth.id);
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

// Helper: remove uploaded files from disk on failure
function cleanupFiles(files) {
  if (!files) return;
  for (const file of files) {
    const filePath = path.join(process.cwd(), 'uploads', file.filename);
    fs.unlink(filePath, () => {}); // best-effort, ignore errors
  }
}

// Uploads images to a listing (step 2 of the draft-to-pending workflow).
// On failure, cleans up any uploaded files and optionally deletes the draft listing.
export async function uploadImages(req, res, next) {
  try {
    const listingId = req.params.id;
    const existing = await listingsService.getListingById(listingId);
    if (!existing) {
      cleanupFiles(req.files);
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (existing.seller_id !== req.auth.id && req.auth.role !== 'admin') {
      cleanupFiles(req.files);
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const images = [];
    try {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageUrl = `/uploads/${file.filename}`;
        const isCover = i === 0 && (!existing.images || existing.images.length === 0);
        const image = await listingImagesRepository.create(listingId, imageUrl, i, isCover);
        images.push(image);
      }
    } catch (dbErr) {
      // DB insert failed — clean up all uploaded files
      cleanupFiles(req.files);
      // If the listing is still a draft, delete it so the seller can retry cleanly
      if (existing.status === 'draft') {
        await listingsService.deleteDraftListing(listingId, req.auth.id);
      }
      throw dbErr;
    }

    res.status(201).json(images);
  } catch (err) {
    next(err);
  }
}
