const User = require("../../models/User");
const Coinpayments = require("coinpayments");
require("dotenv").config();

const coinpayments_client = new Coinpayments({
  key: process.env.CP_CLIENT_KEY,
  secret: process.env.CP_CLIENT_SECRET,
});

const ipn_url = process.env.IPN_URL || "http://localhost:4000/payments/hook";
const client_url = process.env.CLIENT_URL || "http://localhost:3000";

exports.createPayment = async function (req, res) {
  const { id } = req.user;
  const { amount, currency, plan_name } = req.body;

  try {
    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).send("Ocurrio un error, intenta nuevamente");
    }

    const { email, name } = findUserById;

    const options = {
      currency1: "USD",
      currency2: currency,
      amount: amount,
      buyer_email: email,
      buyer_name: name,
      item_name: plan_name,
      ipn_url,
      success_url: `${client_url}/dashboard`,
      cancel_url: `${client_url}/dashboard/checkout`,
    };

    await coinpayments_client.createTransaction(options, (err, response) => {
      if (err)
        return res
          .status(400)
          .send("Ocurrio un error al intentar crear la factura");

      return res.status(200).json(response);
    });
  } catch (error) {
    console.error(error);
  }
};
