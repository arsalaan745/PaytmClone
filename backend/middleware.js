import jwt from "jsonwebtoken";
import JWT_SECRET from "../config.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Unauthorized: Token missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1]; // Extracting token after Bearer.

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Forbidden: Invalid or expired token",
    });
  }
};

export default authMiddleware;
