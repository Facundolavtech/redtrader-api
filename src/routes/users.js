const { Router } = require("express");

const router = Router();

const {
  createUser,
  loginUser,
  authUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const {
  sendResetPasswordEmail,
} = require("../controllers/users/forgotPassword");

const { updatePlan } = require("../controllers/users/updatePlan");
const { resetPassword } = require("../controllers/users/resetPassword");
const {
  sendConfirmPasswordEmail,
  confirmAccount,
} = require("../controllers/users/confirmAccount");

const {
  checkUserIdentity,
  authMiddleware,
} = require("../middlewares/user.middleware");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/auth", authMiddleware, authUser);
router.get("/:id", getUser);
router.put("/:id", checkUserIdentity, updateUser);
router.delete("/:id", checkUserIdentity, deleteUser);
router.post("/sendconfirmemail", sendConfirmPasswordEmail);
router.post("/confirmaccount", confirmAccount);
router.post("/forgotpassword", sendResetPasswordEmail);
router.post("/resetpassword", resetPassword);
router.post("/updateplan", updatePlan);

module.exports = router;
