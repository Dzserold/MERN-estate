import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  // Hash the password so it will be safe
  const hashedPassword = bcryptjs.hashSync(password, 10); //hashSync uses await so you dont need await for it

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    // Saves the date to mongoDB
    await newUser.save();
    // Ressponse messege to the client on success
    res.status(201).json("User created successfully");
  } catch (error) {
    // Response msg to client on error
    res.status(500).json(error.message);
  }
};
