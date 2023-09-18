const jwt = require("jsonwebtoken");
const TOKEN_KEY = "trancongtien";

function generateAccessToken(userModel) {
  return jwt.sign({ data: userModel }, TOKEN_KEY, {
    expiresIn: "21d",
  });
}
module.exports = {
  generateAccessToken,
};
