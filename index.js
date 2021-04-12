require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const { PORT } = process.env;

app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  return res.json({
    status: true,
    message: "api gateway vehicle rental app already running"
  });
});

app.listen(PORT, () => {
  console.log(`app listen on port ${PORT}`);
});
