const express = require("express");
const { searchUsers } = require("../controllers/userController/search.js");
const router = express.Router();

router.get("/search", searchUsers);

module.exports = router;
