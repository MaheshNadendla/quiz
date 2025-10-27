const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { supabase } = require("../config/database");

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google token, fetch or create user in Supabase,
 * and return both user + JWT token
 */
const verifyGoogleTokenAndCreateUser = async (token) => {
  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: google_id } = ticket.getPayload();

    // Check if user exists
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("google_id", google_id)
      .maybeSingle();

    if (selectError) throw selectError;

    let user = existingUser;

    // If not found, create a new user
    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            google_id,
            name,
            email,
            picture,
            is_subscribed: false,
            is_admin: false,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      user = newUser;
    }

    const jwtPayload = {
      id: user._id,
      googleId: user.google_id,
      name:user.name,
      email: user.email,
      picture: user.picture,
      isSubscribed: user.is_subscribed,
      isAdmin: user.is_admin,
    };

    // Generate JWT token
    const jwtToken = jwt.sign(

      jwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return result
    return { user, jwtToken };
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    throw new Error("Google token verification failed");
  }
};

module.exports = { verifyGoogleTokenAndCreateUser };
