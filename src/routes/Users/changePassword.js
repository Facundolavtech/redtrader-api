const { Router } = require("express");
const router = Router();
const { authMiddleware } = require("../../middlewares/auth.middleware");
const {
  changePassword,
} = require("../../controllers/users/changePassword.controller");

//ROUTE
// /api/users/changePassword

router.put("/", authMiddleware, changePassword);

module.exports = router;
