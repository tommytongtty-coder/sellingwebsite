import { getDb } from '../../database/connection';

export async function findAll(filters = {}) {
  const pool = await getDb();
  const conditions = [];
  const params = [];

  if (filters.status) {
    conditions.push('l.status = ?');
    params.push(filters.status);
  }

  if (filters.condition) {
    conditions.push('l.`condition` = ?');
    params.push(filters.condition);
  }

  if (filters.location) {
    conditions.push('l.location = ?');
    params.push(filters.location);
  }

  if (filters.category_id) {
    conditions.push('l.category_id = ?');
    params.push(filters.category_id);
  }

  const where = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  const [rows] = await pool.query(
    `SELECT l.id, l.title, l.gpu_model, l.brand, l.price, l.is_fixed_price,
            l.\`condition\`, l.quantity, l.location, l.status, l.views,
            l.created_at, l.updated_at,
            u.display_name AS seller_name,
            c.name AS category,
            (SELECT li.image_url FROM listing_images li
               WHERE li.listing_id = l.id AND li.is_cover = TRUE
               LIMIT 1) AS cover_image
       FROM listings l
       JOIN users u ON u.id = l.seller_id
       LEFT JOIN categories c ON c.id = l.category_id
       ${where}
      ORDER BY l.created_at DESC`,
    params
  );
  return rows;
}

export async function findById(id) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT l.*, u.display_name AS seller_name, u.avatar_url AS seller_avatar,
            u.rating AS seller_rating,
            c.name AS category
       FROM listings l
       JOIN users u ON u.id = l.seller_id
       LEFT JOIN categories c ON c.id = l.category_id
      WHERE l.id = ?`,
    [id]
  );

  if (!rows[0]) return null;

  const [images] = await pool.query(
    `SELECT id, image_url, sort_order, is_cover
       FROM listing_images
      WHERE listing_id = ?
      ORDER BY sort_order`,
    [id]
  );

  return { ...rows[0], images };
}

export async function create(data) {
  const pool = await getDb();
  const [result] = await pool.query(
    `INSERT INTO listings
       (seller_id, category_id, title, gpu_model, brand, manufacturer, vram_gb,
        description, price, is_fixed_price, \`condition\`, quantity, location,
        allow_meetup, allow_delivery, is_certified, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.seller_id,
      data.category_id || null,
      data.title,
      data.gpu_model || null,
      data.brand || null,
      data.manufacturer || null,
      data.vram_gb || null,
      data.description || null,
      data.price,
      data.is_fixed_price || false,
      data.condition || 'used',
      data.quantity || 1,
      data.location || null,
      data.allow_meetup || false,
      data.allow_delivery || false,
      data.is_certified || false,
      data.status || 'pending',
    ]
  );
  return findById(result.insertId);
}

export async function update(id, data) {
  const pool = await getDb();
  const fields = [];
  const params = [];

  const allowed = [
    'category_id', 'title', 'gpu_model', 'brand', 'manufacturer', 'vram_gb',
    'description', 'price', 'is_fixed_price', 'quantity', 'location',
    'allow_meetup', 'allow_delivery', 'is_certified', 'status',
  ];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(key === 'condition' ? '`condition` = ?' : `${key} = ?`);
      params.push(data[key]);
    }
  }

  if (data.condition !== undefined) {
    fields.push('`condition` = ?');
    params.push(data.condition);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  await pool.query(
    `UPDATE listings SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
  return findById(id);
}

export async function incrementViews(id) {
  const pool = await getDb();
  await pool.query(
    'UPDATE listings SET views = views + 1 WHERE id = ?',
    [id]
  );
}
