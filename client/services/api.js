import { useState, useEffect } from 'react';

// Guard for SSR / Node.js (Node 25+ exposes a non-browser localStorage global)
const storage =
  typeof window !== 'undefined' &&
  window.localStorage &&
  typeof window.localStorage.getItem === 'function'
    ? window.localStorage
    : null;

// ── Helper: get stored JWT token ─────────────────────────────
function getToken() {
  return storage && storage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.detail || body.message || body.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────
export async function register(data) {
  const result = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (storage) storage.setItem('token', result.token);
  return result;
}

export async function login(data) {
  const result = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (storage) storage.setItem('token', result.token);
  return result;
}

export function logout() {
  if (storage) storage.removeItem('token');
}

// ── Categories (hook) ─────────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((rows) => setCategories(rows))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  return categories;
}

// ── Listings (hook) ───────────────────────────────────────────
export function useListings(filters = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    const qs = params.toString();
    fetch(`/api/listings${qs ? '?' + qs : ''}`)
      .then((r) => r.json())
      .then((rows) => { setListings(rows); setLoading(false); })
      .catch((err) => { console.error('Failed to load listings:', err); setLoading(false); });
  }, []);

  return { listings, loading };
}

// ── Listings (functions) ──────────────────────────────────────
export async function getListing(id) {
  return apiFetch(`/api/listings/${id}`);
}

export async function createListing(data) {
  return apiFetch('/api/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateListing(id, data) {
  return apiFetch(`/api/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function uploadListingImages(listingId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));
  const res = await fetch(`/api/listings/${listingId}/images`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || body.message || body.error || 'Upload failed');
  }
  return res.json();
}

export async function publishListing(listingId) {
  return apiFetch(`/api/listings/${listingId}/publish`, { method: 'POST' });
}

// ── User ──────────────────────────────────────────────────────
export async function getMe() {
  return apiFetch('/api/users/me');
}

export async function getMyListings() {
  return apiFetch('/api/users/me/listings');
}

export async function getMyFavorites() {
  return apiFetch('/api/users/me/favorites');
}

export async function getMyOffers() {
  return apiFetch('/api/users/me/offers');
}

export async function getUserProfile(id) {
  return apiFetch(`/api/users/${id}`);
}

// ── Favorites ─────────────────────────────────────────────────
export async function addFavorite(listingId) {
  return apiFetch('/api/favorites', {
    method: 'POST',
    body: JSON.stringify({ listing_id: listingId }),
  });
}

export async function removeFavorite(listingId) {
  return apiFetch(`/api/favorites/${listingId}`, { method: 'DELETE' });
}

// ── Offers ────────────────────────────────────────────────────
export async function createOffer(data) {
  return apiFetch('/api/offers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getListingOffers(listingId) {
  return apiFetch(`/api/offers/listing/${listingId}`);
}

export async function updateOfferStatus(id, status) {
  return apiFetch(`/api/offers/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ── Conversations + Messages ──────────────────────────────────
export async function getConversations() {
  return apiFetch('/api/conversations');
}

export async function createConversation(listingId) {
  return apiFetch('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ listing_id: listingId }),
  });
}

export async function getMessages(conversationId) {
  return apiFetch(`/api/conversations/${conversationId}/messages`);
}

export async function sendMessage(conversationId, body) {
  return apiFetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export async function markAsRead(conversationId) {
  return apiFetch(`/api/conversations/${conversationId}/read`, { method: 'PATCH' });
}

// ── Reports ───────────────────────────────────────────────────
export async function createReport(data) {
  return apiFetch('/api/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Admin ─────────────────────────────────────────────────────
export async function adminGetListings() {
  return apiFetch('/api/admin/listings');
}

export async function adminGetListing(id) {
  return apiFetch(`/api/admin/listings/${id}`);
}

export async function adminUpdateListing(id, data) {
  return apiFetch(`/api/admin/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminApproveListing(id) {
  return apiFetch(`/api/admin/listings/${id}/approve`, { method: 'POST' });
}

export async function adminRejectListing(id) {
  return apiFetch(`/api/admin/listings/${id}/reject`, { method: 'POST' });
}

export async function adminGetLogs() {
  return apiFetch('/api/admin/logs');
}

export async function adminGetConversations() {
  return apiFetch('/api/admin/conversations');
}
