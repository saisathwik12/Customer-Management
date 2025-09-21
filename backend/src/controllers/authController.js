const { getPool } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(req, res, next) {
  const { email, password } = req.body;
  const pool = getPool();
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hash]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  const pool = getPool();
  try {
    const { rows, rowCount } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rowCount === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerUser, loginUser };