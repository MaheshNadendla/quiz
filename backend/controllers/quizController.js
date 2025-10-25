import { supabase } from '../config/db.js';

export const getQuizzes = async (req, res) => {
  const { data, error } = await supabase.from('quizzes').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const addQuiz = async (req, res) => {
  const { title, questions } = req.body;
  const { data, error } = await supabase.from('quizzes').insert([{ title, questions }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const getQuizById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('quizzes').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};
