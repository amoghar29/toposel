const User = require("../../models/User.js");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const jwt = require("jsonwebtoken");

const loginSchema = z.object({
  username: z.string().nonempty("Username is required."),
  password: z.string().nonempty("Password is required."),
});
const loginUser = async (req, res) => {
  try {
    const parsedData = loginSchema.parse(req.body);

    const user = await User.findOne({
      $or: [{ username: parsedData.username }, { email: parsedData.username }],
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(parsedData.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Set cookie first
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Then send JSON response
    return res.json({
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginUser };