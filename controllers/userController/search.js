const User = require("../../models/User");

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.findOne({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("-password") 
      

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No user found" });
    }

    res.json({ users });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { searchUsers };
