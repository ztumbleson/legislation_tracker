//
// repositories/legislatorsRepository.js
// 05-09-2026
// Selects the legislator data access implementation based on environment
//

const USE_SUPABASE = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = USE_SUPABASE
  ? require('./dataAccess/legislators/supabase')
  : require('./dataAccess/legislators/local');
