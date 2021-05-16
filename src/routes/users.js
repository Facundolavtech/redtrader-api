const { Router } = require("express");

const {
  createUser,
  loginUser,
  authUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const { sendResetPasswordEmail } = require("../controllers/users/forgotpw");
const { checkAdmin } = require("../middlewares/admin.middleware");
const { resetPassword } = require("../controllers/users/resetpw");
const {
  sendConfirmPasswordEmail,
  confirmAccount,
  getConfirmToken,
} = require("../controllers/users/confirm");

const {
  checkUserIdentity,
  authMiddleware,
} = require("../middlewares/user.middleware");

const { updatePlan } = require("../controllers/users/updateplan");
const {
  updatePlanAdmin,
  updateAdmin,
  updateEducator,
  deleteAccount,
} = require("../controllers/admin");

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/auth", authMiddleware, authUser);
router.get("/:id", getUser);
router.put("/:id", checkUserIdentity, updateUser);
router.delete("/:id", checkUserIdentity, deleteUser);
router.post("/sendconfirmemail", sendConfirmPasswordEmail);
router.post("/confirmaccount", confirmAccount);
router.get("/confirmaccount/:id", getConfirmToken);
router.post("/forgotpassword", sendResetPasswordEmail);
router.post("/resetpassword", resetPassword);
router.post("/updateplan", updatePlan);
router.put("/admin/updatePlan/:id", checkAdmin, updatePlanAdmin);
router.put("/admin/updateAdmin/:id", checkAdmin, updateAdmin);
router.put("/admin/updateEducator/:id", checkAdmin, updateEducator);
router.delete("/admin/deleteAccount/:id/:email", checkAdmin, deleteAccount);

module.exports = router;
