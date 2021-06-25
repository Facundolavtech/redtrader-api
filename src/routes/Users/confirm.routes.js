const { Router } = require("express");

const router = Router();

const {
  confirm,
  sendEmail,
  getConfirmToken,
} = require("../../controllers/users/confirmAccount.controller");

//ROUTE
// /api/users/confirm

router.post("/sendconfirmemail", sendEmail);
router.post("/confirmaccount", confirm);
router.get("/confirmaccount/:id", getConfirmToken);

module.exports = router;
