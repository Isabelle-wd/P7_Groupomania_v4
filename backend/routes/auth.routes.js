const { verifySignUp } = require("../middleware")
const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")

router.post(
  "api/auth/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.signup
)
router.post(
  "api/auth/signin", 
  authController.signin
)

module.exports = router;