const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const { supabase } = require("../config/db");
dotenv.config();

// Google OAuth Client to verify the token
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to verify Google token and create user if necessary
const verifyGoogleTokenAndCreateUser = async (token) => {
  try {
    // Verify the token using Google OAuth client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract the user info from the token payload
    const { name, email, picture, sub } = ticket.getPayload();
    const google_id = sub;

    console.log("gid : ",google_id)

    // Check if the user already exists in the database
          const { data , error  } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', sub)
        .single();

      // if (fetchError && fetchError.code !== 'PGRST116') {
      //   // An actual error occurred (PGRST116 = no rows found)
      //   return { error: error.message };
      // }

      let user = data;

      if (!user) {
        // User doesn't exist, create a new one
        const { data, error } = await supabase
          .from('users')
          .insert([{ google_id, name, email, picture }])
          .select()
          .single(); // select() + single() returns the inserted row

        if (error) return { error: error.message };

        user = data;
      }

    // Generate JWT token with the user's ID and subscription status
    const jwtToken = jwt.sign(
      { userId: user.id, isSubscribed: user.is_subscribed },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return user details and the generated JWT token
    return { user, jwtToken };
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    throw new Error("Google token verification failed");
  }
};

module.exports = { verifyGoogleTokenAndCreateUser };
