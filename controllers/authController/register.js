  const User = require("../../models/User.js");
  const bcrypt = require("bcryptjs");
  const { z } = require("zod");

  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long."),
    email: z.string().email("Invalid email format."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    fullName: z.string().nonempty("Full name is required."),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format.",
  }),
    country: z.string().nonempty("Country is required."),
  });

  const registerUser = async (req, res) => {
    try {
      const parsedData = registerSchema.parse(req.body);

      const userExists = await User.findOne({
        $or: [{ email: parsedData.email }, { username: parsedData.username }],
      });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(parsedData.password, 12);

      const user = new User({
        username: parsedData.username,
        email: parsedData.email,
        password: hashedPassword,
        fullName: parsedData.fullName,
        gender: parsedData.gender,
        dateOfBirth: parsedData.dateOfBirth,
        country: parsedData.country,
      });

      await user.save();

      res
        .status(201)
        .json({ message: "User registered successfully. Login to continue" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  };

  module.exports = { registerUser };
