//
// dataAccess/legislators/supabase.js
// 05-09-2026
// Supabase data access implementation for the legislator table
//

const supabase = require('../supabaseClient');

async function findAll() {
  const { data, error } = await supabase.from('legislator').select('*').order('last_name');
  if (error) throw error;
  return data;
}

async function findById(id) {
  const { data, error } = await supabase.from('legislator').select('*').eq('id', id).single();
  if (error?.code === 'PGRST116') return null;
  if (error) throw error;
  return data;
}

async function create(fields) {
  const { data, error } = await supabase.from('legislator').insert(fields).select().single();
  if (error) throw error;
  return data;
}

async function update(id, fields) {
  const { data, error } = await supabase
    .from('legislator')
    .update(fields)
    .eq('id', id)
    .select()
    .single();
  if (error?.code === 'PGRST116') return null;
  if (error) throw error;
  return data;
}

async function remove(id) {
  const { error } = await supabase.from('legislator').delete().eq('id', id);
  if (error) throw error;
}

module.exports = { findAll, findById, create, update, remove };
