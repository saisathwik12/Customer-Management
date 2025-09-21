// Build SQL WHERE clauses from ?city=x&state=y&pin_code=z as filter for customer list
function buildSearchWhere(query, allowedFields) {
  const filters = [];
  const params = [];
  let idx = 1;
  for (const f of allowedFields) {
    if (query[f]) {
      filters.push(`${f} = $${idx}`);
      params.push(query[f]);
      idx++;
    }
  }
  const whereClause = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
  return { whereClause, params };
}

// Build PostgreSQL LIMIT/OFFSET for paginated listing
function buildPagination(query) {
  const limit = parseInt(query.limit) || 20;
  const offset = parseInt(query.offset) || 0;
  const limitClause = `LIMIT ${limit}`;
  const offsetClause = `OFFSET ${offset}`;
  return { limitClause, offsetClause, limit, offset };
}

module.exports = { buildSearchWhere, buildPagination };
