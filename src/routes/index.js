const express = require("express");
const Auth = require("./auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Vehicle Api already running",
  });
});

router.use("/auth", Auth);

router.all("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Url is not valid, please check the documentation",
  });
});

module.exports = router;
