import * as usersService from '../services/users.service';

export async function getMe(req, res, next) {
  try {
    const user = await usersService.getCurrentUser(req.auth.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const user = await usersService.getPublicProfile(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getMyListings(req, res, next) {
  try {
    const listings = await usersService.getUserListings(req.auth.id);
    res.json(listings);
  } catch (err) {
    next(err);
  }
}

export async function getMyFavorites(req, res, next) {
  try {
    const favorites = await usersService.getUserFavorites(req.auth.id);
    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

export async function getMyOffers(req, res, next) {
  try {
    const offers = await usersService.getUserOffers(req.auth.id);
    res.json(offers);
  } catch (err) {
    next(err);
  }
}
