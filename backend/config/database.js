const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const connect = async () => {
  try {
    console.log("Connected to Supabase successfully!");
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
  }
};

module.exports = { supabase, connect };
