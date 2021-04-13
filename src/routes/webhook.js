const { Router } = require("express");
const Coinpayments = require("coinpayments");

const router = Router();

const cpClient = new Coinpayments({
  key: "5b41c1c62e6f26d87ebe576d50acccea5e9b5c843181136a040742ab7c7e6fab",
  secret: "D83DE6Bc7EdF41a0581c5705811911043f28e42Fc0DAaA83bf721Fd3d01bbef1",
});

router.post("/hook", async (req, res) => {
  console.log(req);
  console.log(req.headers);
  const data = req.body;
  console.log(data);
  const options = {
    txid: "CPFD36ENT8VNTXGHBTIA8M0GOS",
  };

  await cpClient.getTx(options, (err, response) => {
    if (err) console.log(err);
    console.log(response);
    res.status(200).json(response);
  });
});

module.exports = router;
