const userService = require("../services/users.service");
const upload = require("../middleware/user.upload");
const path = require("path");

exports.register = (req, res, next) => {
   const avartar = req.files.avartar?.tempFilePath;
  console.log(avartar);
  var model = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avartar: avartar,
  };

  userService.register(model, (error, results) => {
    if (error) {
      return next(error);
    } else {
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    }
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  userService.login(email, password, (error, results) => {
    if (error) {
      return next(error);
    }

    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};
