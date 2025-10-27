const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("req.body : ",req.body)

  // console.log("req.headers : ",req.headers)

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing credentials whw" });
  }

  const token = authHeader.split(" ")[1];

  console.log("token is : ",token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //=> here is the error its is not console the next line

    console.log("decoded : ",decoded)

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Admins only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
