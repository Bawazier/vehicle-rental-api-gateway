const http = require("../helpers/http");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const api = http(process.env.URL_AUTH_SERVICE);
const schemaRegister = Joi.object({
  rolesId: Joi.number().integer().positive().required(),
  name: Joi.string().min(3).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  phone: Joi.number().integer().min(1000000000).max(99999999999).required(),
});
const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

module.exports = {
  register: async (req, res) => {
    try {
      const result = await schemaRegister.validateAsync(req.body);
      const user = await api.post("/auth/register", result);

      return res.json(user.data);
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        return res.status(500).json({
          success: false,
          message: "Service unavailable",
        });
      }

      const { status, data } = error.response;
      return res.status(status).json(data);
    }
  },
  login: async (req, res) => {
    try {
      const result = await schemaLogin.validateAsync(req.body);
      const user = await api.post("/auth/login", result);
      const data = user.data.results;

      const token = jwt.sign(
        { id: data.id, rolesId: data.rolesId },
        process.env.SECRET_TOKEN,
        {
          expiresIn: "1d",
        }
      );

      return res.json({
        success: true,
        message: "Login success",
        result: {
          ...data,
          token,
        },
      });
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        return res.status(500).json({
          success: false,
          message: "Service unavailable",
        });
      }

      const { status, data } = error.response;
      return res.status(status).json(data);
    }
  },
};