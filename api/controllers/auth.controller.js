import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { userInfo } from "os";

export const signUp = async (req, res, next) => {
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
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Checking the user on mongoDB
    const validUser = await User.findOne({ email: email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    // Checking the passvord using crypting
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid password!"));

    // Token will mix the user ID and App secret key witch is an environment variable
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // Destructure the User info so we can sand back the data without password
    const { password: hashedPassword, ...rest } = validUser._doc;
    // Saving token as a cookie as 'access_token' name and give it more informations
    res
      .cookie("access_token", token, {
        httpOnly: true, // No third part apps can access this cookie
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cookie expires after 1000 day
      })
      .status(200)
      .json(rest); //Data without password
  } catch (error) {
    next(error);
  }
};
