const User = require("../../models/User");
const Coinpayments = require("coinpayments");

const cpClient = new Coinpayments({
  key: "5b41c1c62e6f26d87ebe576d50acccea5e9b5c843181136a040742ab7c7e6fab",
  secret: "D83DE6Bc7EdF41a0581c5705811911043f28e42Fc0DAaA83bf721Fd3d01bbef1",
});

exports.createPay = async function (req, res) {
  const userId = req.user.id;
  const { amount, currency } = req.body;

  try {
    const findUserById = await User.findById(userId);

    if (!findUserById) {
      return res.status(404).send("No se encuentra el usuario");
    }

    const { email, name } = findUserById;

    const options = {
      currency1: "USD",
      currency2: currency,
      amount: amount,
      buyer_email: email,
      buyer_name: name,
      item_name: "Plan mensual RedTrader",
      ipn_url: "https://redtrader-api.herokuapp.com/payhook",
      success_url: "https://redtraderacademy.com/dashboard",
      cancel_url: "https://redtraderacademy.com/dashboard/pay",
    };

    await cpClient.createTransaction(options, (err, response) => {
      if (err) return res.status(400).send(err);

      return res.status(200).json(response);
    });
  } catch (error) {}
};
