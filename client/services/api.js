import { useState, useEffect } from 'react';

// Guard for SSR where localStorage is not available
const storage = typeof localStorage !== 'undefined' ? localStorage : null;

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

export async function getConversation(id) {
  return apiFetch(`/api/conversations/${id}`);
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
// The console keeps its own session under ADMIN_TOKEN_KEY so that signing in
// as an admin never disturbs the shopper's session (and vice versa).
export const ADMIN_TOKEN_KEY = 'admin_token';

export function getAdminToken() {
  return storage && storage.getItem(ADMIN_TOKEN_KEY);
}

function adminFetch(url, options = {}) {
  const token = getAdminToken();
  // Fail closed: never let the shopper's token reach an admin endpoint
  if (!token) {
    const err = new Error('Not signed in as an admin');
    err.status = 401;
    return Promise.reject(err);
  }
  return apiFetch(url, {
    ...options,
    // Listed after options.headers spread inside apiFetch would lose, so the
    // admin token is applied here and overrides the shopper's Authorization
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });
}

export async function adminLogin({ username, password }) {
  // The login endpoint takes a username or an email in the `email` field
  const result = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: username, password }),
  });
  if (result.user && result.user.role !== 'admin') {
    const err = new Error('That account is not an admin');
    err.status = 403;
    throw err;
  }
  if (storage) storage.setItem(ADMIN_TOKEN_KEY, result.token);
  return result;
}

export function adminLogout() {
  if (storage) storage.removeItem(ADMIN_TOKEN_KEY);
}

export async function adminGetMe() {
  return adminFetch('/api/users/me');
}

export async function adminGetListings() {
  return adminFetch('/api/admin/listings');
}

export async function adminGetListing(id) {
  return adminFetch(`/api/admin/listings/${id}`);
}

export async function adminUpdateListing(id, data) {
  return adminFetch(`/api/admin/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminApproveListing(id) {
  return adminFetch(`/api/admin/listings/${id}/approve`, { method: 'POST' });
}

export async function adminRejectListing(id) {
  return adminFetch(`/api/admin/listings/${id}/reject`, { method: 'POST' });
}

export async function adminGetLogs() {
  return adminFetch('/api/admin/logs');
}

export async function adminGetConversations() {
  return adminFetch('/api/admin/conversations');
}

// Get-or-create the admin support thread for a listing
export async function adminOpenListingChat(listingId) {
  return adminFetch(`/api/admin/listings/${listingId}/chat`, { method: 'POST' });
}

// The admin is a participant on its support threads (it holds buyer_id), so
// the regular conversation endpoints work — they just need the admin token.
export async function adminGetConversation(id) {
  return adminFetch(`/api/conversations/${id}`);
}

export async function adminGetMessages(conversationId) {
  return adminFetch(`/api/conversations/${conversationId}/messages`);
}

export async function adminSendMessage(conversationId, body) {
  return adminFetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export async function adminMarkAsRead(conversationId) {
  return adminFetch(`/api/conversations/${conversationId}/read`, { method: 'PATCH' });
}
