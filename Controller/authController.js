const beycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/UserModel");

// Register a new user

const register = async (req, res) => {
  try {
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, mobile, password } = req.body;

    //hash password
    const bycryptSalt = await beycrpt.genSalt(10);
    const hashedPassword = await beycrpt.hash(password, bycryptSalt);

    // Create a new user

    const newUser = new User({ name, email, password: hashedPassword, mobile });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if the password is correct
    const validPassword = await beycrpt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Create and assign a token
    const Accsetoken = jwt.sign(
      { _id: user._id, user: user },
      process.env.TOKEN_SECRET,
      { expiresIn: "2h" }
    );
    const Refrechtoken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "4h",
    });

    res.status(201).json({
      success: true,
      message: "User logged in successfully!",
      user,
      Accsetoken: Accsetoken,
      Refrechtoken: Refrechtoken,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

const profile = async (req, res) => {
  try {
    const user = req.user;
    console.log("user", user);
    return res.status(201).json({
      success: true,
      message: "User profile  data",
      user_id: user._id,
      user_name: user.name,
      user_email: user.email,
      user_mobile: user.mobile,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "profile data  failed" });
  }
};

module.exports = { register, login, profile };
