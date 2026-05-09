const supabase = require('../supabaseClient');

const sponsorSelect = `
  id, title, text, created_at,
  legislation_sponsors (
    legislator ( id, first_name, last_name )
  )
`;

function flattenSponsors(row) {
  return {
    ...row,
    sponsors: (row.legislation_sponsors ?? []).map((s) => s.legislator),
    legislation_sponsors: undefined,
  };
}

async function findAll() {
  const { data, error } = await supabase
    .from('legislation')
    .select(sponsorSelect)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(flattenSponsors);
}

async function findById(id) {
  const { data, error } = await supabase
    .from('legislation')
    .select(sponsorSelect)
    .eq('id', id)
    .single();
  if (error?.code === 'PGRST116') return null;
  if (error) throw error;
  return flattenSponsors(data);
}

async function create(title, text, sponsorIds = []) {
  const { data: legislation, error: legError } = await supabase
    .from('legislation')
    .insert({ title, text })
    .select('id, title, text, created_at')
    .single();
  if (legError) throw legError;

  if (sponsorIds.length > 0) {
    const rows = sponsorIds.map((id) => ({ legislation_id: legislation.id, legislator_id: id }));
    const { error: sponsorError } = await supabase.from('legislation_sponsors').insert(rows);
    if (sponsorError) throw sponsorError;
  }

  return { ...legislation, sponsors: sponsorIds };
}

async function update(id, title, text, sponsorIds = []) {
  const { data: legislation, error: legError } = await supabase
    .from('legislation')
    .update({ title, text })
    .eq('id', id)
    .select('id, title, text, created_at')
    .single();
  if (legError?.code === 'PGRST116') return null;
  if (legError) throw legError;

  await supabase.from('legislation_sponsors').delete().eq('legislation_id', id);
  if (sponsorIds.length > 0) {
    const rows = sponsorIds.map((sid) => ({ legislation_id: id, legislator_id: sid }));
    const { error: sponsorError } = await supabase.from('legislation_sponsors').insert(rows);
    if (sponsorError) throw sponsorError;
  }

  return { ...legislation, sponsors: sponsorIds };
}

async function remove(id) {
  const { error } = await supabase.from('legislation').delete().eq('id', id);
  if (error) throw error;
}

module.exports = { findAll, findById, create, update, remove };
