const { supabase } = require('../config/db.js');

exports.registerUser = async (req, res) => {
  const { google_id,name, email } = req.body;
  const { data, error } = await supabase.from('users').insert([{ google_id,name, email }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

exports.getUserScores = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('scores').select('*').eq('user_id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
