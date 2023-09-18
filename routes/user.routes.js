const { login, signup } = require("../controller/userController");

const router = require("express").Router();

router.post("/register", signup);
router.post("/login", login);

// router.post('/login',authController.loginUser);
// router.get('/location',authController.getLocation);
// router.put('/location',authController.updateLocation);
module.exports = router;
