import * as offersService from '../services/offers.service';

export async function getOffersForListing(req, res, next) {
  try {
    const offers = await offersService.getOffersForListing(req.params.listingId);
    res.json(offers);
  } catch (err) {
    next(err);
  }
}

export async function createOffer(req, res, next) {
  try {
    const { listing_id, amount, message } = req.body;
    const offer = await offersService.createOffer({
      listing_id,
      buyer_id: req.auth.id,
      amount,
      message,
    });
    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
}

export async function updateOfferStatus(req, res, next) {
  try {
    const offer = await offersService.getOfferById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    if (offer.seller_id !== req.auth.id) {
      return res.status(403).json({ error: 'Only the seller can update offer status' });
    }
    const updated = await offersService.updateOfferStatus(req.params.id, req.body.status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
