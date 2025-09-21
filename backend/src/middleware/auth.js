const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ success: false, message: 'Missing Authorization header' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Invalid token format' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };