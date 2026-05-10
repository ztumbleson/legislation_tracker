//
// dataAccess/legislation/supabase.js
// 05-09-2026
// Supabase data access implementation for the legislation table and sponsor relationships
//

const supabase = require('../supabaseClient');

const sponsorSelect = `
  id, title, text, created_at,
  legislation_sponsors (
    legislator ( id, first_name, last_name )
  )
`;

function flattenSponsors({ legislation_sponsors, ...row }) {
  return {
    ...row,
    sponsors: (legislation_sponsors ?? []).map((s) => s.legislator),
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

  const { error: deleteError } = await supabase
    .from('legislation_sponsors')
    .delete()
    .eq('legislation_id', id);
  if (deleteError) throw deleteError;

  if (sponsorIds.length > 0) {
    const rows = sponsorIds.map((sid) => ({ legislation_id: id, legislator_id: sid }));
    const { error: sponsorError } = await supabase.from('legislation_sponsors').insert(rows);
    if (sponsorError) throw sponsorError;
  }

  return { ...legislation, sponsors: sponsorIds };
}

async function findBySponsor(legislatorId) {
  const { data, error } = await supabase
    .from('legislation')
    .select('id, title, text, created_at, legislation_sponsors!inner(legislator_id)')
    .eq('legislation_sponsors.legislator_id', legislatorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(({ id, title, text, created_at }) => ({ id, title, text, created_at }));
}

async function remove(id) {
  const { error } = await supabase.from('legislation').delete().eq('id', id);
  if (error) throw error;
}

module.exports = { findAll, findById, findBySponsor, create, update, remove };
