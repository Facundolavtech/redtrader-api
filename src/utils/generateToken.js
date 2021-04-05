const jwt = require("jsonwebtoken");

module.exports = async function generateToken(payload) {
  const token = await jwt.sign(payload, process.env.AUTH_USER_PRIVATE_KEY, {
    expiresIn: "604800s",
  });

  return token;
};
