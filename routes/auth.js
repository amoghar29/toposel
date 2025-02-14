const express = require("express");
const { registerUser } = require("../controllers/authController/register.js");
const { loginUser } = require("../controllers/authController/login.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
