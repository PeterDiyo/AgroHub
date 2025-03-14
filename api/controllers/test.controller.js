import jwt from "jsonwebtoken";

// THIS IS A TEST CONTROLLER TO CHECK IF THE USER IS LOGGED IN OR NOT.
export const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId);

  // If the token is valid, the user is logged in.
  res.status(200).json({ message: "You are Authenticated" });
};

// THIS IS A TEST CONTROLLER TO CHECK IF THE USER IS AN ADMIN OR NOT.
export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.status(200).json({ message: "You are Authenticated" });
  });
};
