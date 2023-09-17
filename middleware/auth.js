const jwt = require("jsonwebtoken");
const TOKEN_KEY = "random";

function generateAccessToken(userModel) {
  return jwt.sign({ data: userModel }, TOKEN_KEY, {
    expiresIn: "21d",
  });
}
module.exports = {
  generateAccessToken,
};
