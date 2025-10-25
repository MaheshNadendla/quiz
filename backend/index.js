const express = require("express");
const app = express();

// Import routes
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const User = require("./models/User.js");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const { cloudinaryConnect } = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 5000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for using postman
app.use(cookieParser());

const frontendDomain = process.env.FRONTEND_DOMAIN
app.use(
  cors({
    origin: frontendDomain,
    credentials: true
  })
);

// app.use(cors({ origin: "*", credentials: true }));


// app.use("/api/admin/*", async (req, res, next) => {
//   try {
//     // Allow GETs to pass through (public reads like questions)
//     if (req.method === "GET") return next();

//     // Multer handles multipart/form-data because express.json() cannot handle multipart/form-data ; express.json() won't populate req.body yet.
//     // Let multipart requests through so the controller can read fields after multer parses.
//     const contentType = req.headers["content-type"] || "";
//     if (contentType.includes("multipart/form-data")) return next();

//     const { googleId } = req.body || {};
//     if (!googleId) return res.status(401).json({ status: 401, message: "Missing credentials" });

//     const user = await User.findOne({ googleId });
//     if (user?.isAdmin) return next();

//     return res.status(403).json({ status: 403, message: "Not an authorized user" });
//   } catch (e) {
//     return res.status(500).json({ status: 500, message: "Auth middleware error" });
//   }
// });


app.use("/api/admin", async (req, res, next) => {
  try {
    if (req.method === "GET") return next();

    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) return next();

    const { googleId } = req.body || {};
    if (!googleId) return res.status(401).json({ status: 401, message: "Missing credentials" });

    const user = await User.findOne({ googleId });
    if (user?.isAdmin) return next();

    return res.status(403).json({ status: 403, message: "Not an authorized user" });
  } catch (e) {
    return res.status(500).json({ status: 500, message: "Auth middleware error" });
  }
});



// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp",
//   })
// );
//cloudinary connection
// cloudinaryConnect();

//routes

app.use("/api", courseRoutes); // Course-related routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/admin", adminRoutes); // Admin-related routes
app.use("/api/auth", authRoutes); // Auth-related routes
app.use("/api/payment", paymentRoutes);

//def route

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
