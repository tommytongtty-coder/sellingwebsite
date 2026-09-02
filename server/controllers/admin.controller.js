import * as adminService from '../services/admin.service';

export async function getAllListings(req, res, next) {
  try {
    const listings = await adminService.getAllListings();
    res.json(listings);
  } catch (err) {
    next(err);
  }
}

export async function getListingById(req, res, next) {
  try {
    const listing = await adminService.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function updateListing(req, res, next) {
  try {
    const listing = await adminService.updateListing(req.params.id, req.body, req.auth.id);
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function approveListing(req, res, next) {
  try {
    const listing = await adminService.approveListing(req.params.id, req.auth.id);
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function rejectListing(req, res, next) {
  try {
    const listing = await adminService.rejectListing(req.params.id, req.auth.id);
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function getLogs(req, res, next) {
  try {
    const logs = await adminService.getLogs();
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

export async function getConversations(req, res, next) {
  try {
    const conversations = await adminService.getConversations();
    res.json(conversations);
  } catch (err) {
    next(err);
  }
}
