const express = require("express");
const auth = require("../middleware/auth.js");
const userRoutes = require("./user.js");
const authRoutes = require("./auth.js");

const router = express.Router();

router.use("/users",auth, userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
