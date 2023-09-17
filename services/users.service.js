const user = require("../models/user");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const auth = require("../middleware/auth");
const cloudinary = require("cloudinary");
async function login(email, password, calback) {
  const userModel = await user.find({ email });

  if (userModel.length != 0) {
    if (bcrypt.compareSync(password, userModel[0].password)) {
      let tokenData;
      tokenData = {
        userId: userModel[0].id,
        email: userModel[0].email,
        name: userModel[0].name,
        description: userModel[0].description,
        location: userModel[0].location,
        avatar: userModel[0].avartar,
      };

      const token = auth.generateAccessToken(tokenData);
      return calback(null, { ...tokenData, token });
    } else {
      return calback({ message: "Invalid Email/Password" });
    }
  } else {
    return calback({
      message: "Invalid Email/Password",
    });
  }
}
async function register(params, calback) {
  let mycloud = {};
  await cloudinary.v2.uploader
    .upload(params.avartar, {
      folder: "avatars",
      resource_type: "image",
    })
    .then((result) => {
      mycloud = result;
    })
    .catch((error) => {
      console.log(error);
    });
  fs.rmSync("./tmp", { recursive: true });
  console.log(mycloud.url);
  params.avartar = {
    url: mycloud.url,
  };
  if (params.email === undefined) {
    return calback({
      message: "Email Required",
    });
  }
  let isUserExits = await user.findOne({ email: params.email });

  if (isUserExits) {
    return calback({
      message: "Email already registered",
    });
  }
  const salt = bcrypt.genSaltSync(10);
  params.password = bcrypt.hashSync(params.password, salt);
  console.log(params);
  const userSchema = new user(params);
  userSchema
    .save()
    .then((response) => {
      console.log(response)
      return calback(null, response);
    })
    .catch((error) => {
      return calback(null, error);
    });
}
module.exports = {
  login,
  register,
};
