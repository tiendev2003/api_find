const expressAsyncHandler = require("express-async-handler");
const userModel = require("../models/user");
const { generateAccessToken } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");
const fs = require("fs");
exports.signup = expressAsyncHandler(async (req, res, next) => {
  // 1- create user
  let isUserExits = await userModel.findOne({ email: req.body.email });

  if (isUserExits) {
    fs.rmSync("./tmp", { recursive: true });
    res.status(409).json({
      message: "Email already registered",
    });
    return next();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
   
    const salt = bcrypt.genSaltSync(10);
    let mycloud = {};
    await cloudinary.v2.uploader
      .upload(req.files.avartar.tempFilePath, {
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
    req.body.avartar = mycloud.url;

    req.body.password = bcrypt.hashSync(req.body.password, salt);
    const user = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avartar: req.body.avartar,
      description: "Tôi là " + req.body.name,
    });
    // 2- Generate Token
    const token = generateAccessToken(user);
    res.status(201).json({ data: user, token });
  }
});
exports.login = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = generateAccessToken(user);
  res.status(200).json({ data: user, token });
});
