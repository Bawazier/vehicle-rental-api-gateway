const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.slice(7, authorization.length);
    try {
      const user = jwt.verify(token, process.env.APP_KEY);
      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(401).json({
          success: false,
          message: "Unauthorization",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden access",
    });
  }
};
