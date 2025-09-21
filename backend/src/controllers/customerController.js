const { getPool } = require('../db');
const { buildSearchWhere, buildPagination } = require('../utils/pagination');

async function createCustomer(req, res, next) {
  const { name, phone } = req.body;
  const userId = req.user.userId;
  const pool = getPool();

  try {
    const query = `
      INSERT INTO customers (name, phone, user_id, created_at)
      VALUES ($1, $2, $3, now())
      RETURNING *`;
    const values = [name, phone, userId];

    const { rows } = await pool.query(query, values);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
} 
async function listCustomers(req, res, next) {
  const pool = getPool();
  const userId = req.user.userId;
  try {
    const { whereClause, params } = buildSearchWhere(req.query, ['city', 'state', 'pin_code']);
    params.push(userId);
    const userFilter = params.length > 0 ? ` AND user_id = $${params.length}` : `WHERE user_id = $1`;
    const where = whereClause ? whereClause + userFilter.replace(' AND', ' AND') : `WHERE user_id = $${params.length}`;

    const { limitClause, offsetClause, limit, offset } = buildPagination(req.query);
    const totalQuery = `SELECT COUNT(*)::int AS total FROM customers ${where}`;
    const totalRes = await pool.query(totalQuery, params);
    const total = totalRes.rows[0].total;

    const dataQuery = `SELECT * FROM customers ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    const dataRes = await pool.query(dataQuery, params.concat([limit, offset]));

    res.json({ success: true, meta: { total, limit, offset }, data: dataRes.rows });
  } catch (err) {
    next(err);
  }
}

async function getCustomerById(req, res, next) {
  const pool = getPool();
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const custRes = await pool.query('SELECT * FROM customers WHERE id = $1 AND user_id = $2', [id, userId]);
    if (custRes.rowCount === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    const customer = custRes.rows[0];
    const addrRes = await pool.query('SELECT * FROM addresses WHERE customer_id = $1 ORDER BY created_at DESC', [id]);
    customer.addresses = addrRes.rows;
    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

async function updateCustomer(req, res, next) {
  const pool = getPool();
  const { id } = req.params;
  const userId = req.user.userId;
  const fields = ['name', 'phone'];
  const updates = [];
  const values = [];
  let idx = 1;
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = $${idx}`);
      values.push(req.body[f]);
      idx++;
    }
  }
  if (updates.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });
  values.push(userId);
  values.push(id);
  const q = `UPDATE customers SET ${updates.join(', ')}, updated_at = now() WHERE user_id = $${idx} AND id = $${idx + 1} RETURNING *`;
  try {
    const { rows, rowCount } = await pool.query(q, values);
    if (rowCount === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

async function deleteCustomer(req, res, next) {
  const pool = getPool();
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const { rowCount } = await pool.query('DELETE FROM customers WHERE id = $1 AND user_id = $2', [id, userId]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer deleted' });
  } catch (err) {
    next(err);
  }
}

// addresses 

async function listAddresses(req, res, next) {
  const pool = getPool();
  const { customerId } = req.params;
  const userId = req.user.userId;
  try {
    const cust = await pool.query('SELECT id FROM customers WHERE id = $1 AND user_id = $2', [customerId, userId]);
    if (cust.rowCount === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    const { rows } = await pool.query('SELECT * FROM addresses WHERE customer_id = $1 ORDER BY created_at DESC', [customerId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function createAddress(req, res, next) {
  const pool = getPool();
  const { customerId } = req.params;
  const { label, address, city, state, pin_code } = req.body;
  const userId = req.user.userId;
  try {
    const cust = await pool.query('SELECT id FROM customers WHERE id = $1 AND user_id = $2', [customerId, userId]);
    if (cust.rowCount === 0)
      return res.status(404).json({ success: false, message: 'Customer not found' });
    const q = `INSERT INTO addresses (customer_id, label, address, city, state, pin_code, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6, now(), now()) RETURNING *`;
    const values = [customerId, label || null, address || null, city, state, pin_code];
    const { rows } = await pool.query(q, values);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateAddress(req, res, next) {
  const pool = getPool();
  const { customerId, addressId } = req.params;
  const userId = req.user.userId;
  const fields = ['label', 'address', 'city', 'state', 'pin_code'];
  const updates = [];
  const values = [];
  let idx = 1;
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = $${idx}`);
      values.push(req.body[f]);
      idx++;
    }
  }
  if (updates.length === 0)
    return res.status(400).json({ success: false, message: 'No fields to update' });
  // Make sure the address belongs to the customer, and customer belongs to user:
  const cust = await pool.query('SELECT id FROM customers WHERE id = $1 AND user_id = $2', [customerId, userId]);
  if (cust.rowCount === 0)
    return res.status(404).json({ success: false, message: 'Customer not found' });
  values.push(customerId);
  values.push(addressId);
  const q = `UPDATE addresses SET ${updates.join(', ')}, updated_at = now()
    WHERE customer_id = $${idx} AND id = $${idx + 1} RETURNING *`;
  try {
    const { rows, rowCount } = await pool.query(q, values);
    if (rowCount === 0)
      return res.status(404).json({ success: false, message: 'Address not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  const pool = getPool();
  const { customerId, addressId } = req.params;
  const userId = req.user.userId;
  // Make sure the address belongs to the customer, and customer belongs to user:
  const cust = await pool.query('SELECT id FROM customers WHERE id = $1 AND user_id = $2', [customerId, userId]);
  if (cust.rowCount === 0)
    return res.status(404).json({ success: false, message: 'Customer not found' });
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND customer_id = $2',
      [addressId, customerId]
    );
    if (rowCount === 0)
      return res.status(404).json({ success: false, message: 'Address not found' });
    res.json({ success: true, message: 'Address deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCustomer,
  listCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};