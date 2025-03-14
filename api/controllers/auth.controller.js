import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

//USER REGISTRATION
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create a new user and save it to the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

//USER LOGIN
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    //Check if the user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    //Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    //Generate a JWT cookie token and send it to the user
    const age = 1000 * 60 * 60 * 24 * 7;

    // this is the token that will be sent to the user
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    // we don't want to send the password to the user
    const { password: userPassword, ...userInfo } = user;

    // resulting token will be stored in the cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login" });
  }
};

//USER LOGOUT
export const logout = async (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
};
