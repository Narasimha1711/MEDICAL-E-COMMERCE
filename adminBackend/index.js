const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const ErrorHandler = require("./middleware/ErrorHandler");
const connectDB = require("./config/dbConnection");
const PORT = process.env.PORT || 9004;
console.log("i am in the express project!");

const cors = require("cors");

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:5173", "http://localhost:9004"],
};
app.use(cors(corsOptions));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

connectDB();
app.use(express.json());
app.use("/api", require("./routes/AdminRoute"));
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});