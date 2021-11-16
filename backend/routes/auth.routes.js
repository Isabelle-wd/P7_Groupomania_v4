const { verifySignUp } = require("../middleware");
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post(
  "/signup", 
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.signup
);

console.log("hello world");

router.post(
  "/signin", 
  authController.signin
);

module.exports = router;