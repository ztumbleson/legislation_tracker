//
// repositories/supabaseClient.js
// 05-09-2026
// Creates supabase/postgres database connection
//

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;
