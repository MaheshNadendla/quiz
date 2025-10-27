// index.js
const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
const cors = require("cors");

const { supabase, connect } = require("./config/database");

// Import routes
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const PORT = process.env.PORT || 5000;

// Connect to Supabase
connect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const frontendDomain = process.env.FRONTEND_DOMAIN;
app.use(
  cors({
    origin: frontendDomain,
    credentials: true,
  })
);

// // Admin middleware (using Supabase now)
// app.use("/api/admin", async (req, res, next) => {
//   try {
//     if (req.method === "GET") return next();

//     // console.log("headers : ",req.headers)

//     const contentType = req.headers["content-type"] || "";
//     if (contentType.includes("multipart/form-data")) return next();

//     const { googleId } = req.body || {};

//     console.log("req.body & googleId : ",req.body) // => here the problem=> google id is not printing

//     if (!googleId)
//       return res.status(401).json({ status: 401, message: "Missing credentials1" });

//     const { data: user, error } = await supabase
//       .from("users")
//       .select("_id, is_admin")
//       .eq("google_id", googleId)
//       .single();

//     if (error) {
//       console.error(error);
//       return res.status(500).json({ status: 500, message: "DB Error" });
//     }

//     if (user?.is_admin) return next();

//     return res.status(403).json({ status: 403, message: "Not an authorized user" });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ status: 500, message: "Auth middleware error" });
//   }
// });


// Routes
app.use("/api", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
