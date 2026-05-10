//
// repositories/legislationRepository.js
// 05-09-2026
// Selects the legislation data access implementation based on environment
//

const USE_SUPABASE = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = USE_SUPABASE
  ? require('./dataAccess/legislation/supabase')
  : require('./dataAccess/legislation/local');
