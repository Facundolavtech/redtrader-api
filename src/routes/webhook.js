const { Router } = require("express");
const Coinpayments = require("coinpayments");

const router = Router();

const cpClient = new Coinpayments({
  key: "5b41c1c62e6f26d87ebe576d50acccea5e9b5c843181136a040742ab7c7e6fab",
  secret: "D83DE6Bc7EdF41a0581c5705811911043f28e42Fc0DAaA83bf721Fd3d01bbef1",
});

router.post("/hook", async (req, res) => {
  console.log(req.body.txn_id);
  console.log(req.body.status);
  console.log(req.status);
});

module.exports = router;
