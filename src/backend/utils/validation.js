//
// validation.js
// 05-09-2026
// Shared request validation utilities
//

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validId = id => UUID_RE.test(id);

module.exports = { validId };
