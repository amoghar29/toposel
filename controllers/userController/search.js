const User = require("../../models/User");
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    const users = await User.findOne({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { searchUsers };