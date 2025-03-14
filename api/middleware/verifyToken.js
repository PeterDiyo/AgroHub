import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  // If there is no token, the user is not logged in.
  if (!token) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  // If there is a token, verify it.
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.userId = payload.id;

    next();
  });
};
