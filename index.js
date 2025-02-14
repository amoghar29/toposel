const express = require("express");
const connectToDB = require("./utils/connection");
const apiRoutes = require("./routes/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

connectToDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
app.use(cors(corsOptions));

app.use("/api/v0", apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
