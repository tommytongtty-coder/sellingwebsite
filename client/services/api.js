import { useState, useEffect } from 'react';

// Fetch category names from the MySQL API
export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((rows) => setCategories(rows.map((r) => r.name)))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  return categories;
}

// Fetch all listings from the MySQL API
export function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings')
      .then((r) => r.json())
      .then((rows) => { setListings(rows); setLoading(false); })
      .catch((err) => { console.error('Failed to load listings:', err); setLoading(false); });
  }, []);

  return { listings, loading };
}
