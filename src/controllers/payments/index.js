const User = require("../../models/User");
const Coinpayments = require("coinpayments");
require("dotenv").config();
const plans = require("../../helpers/Plans");
const calculateDiscount = require("../../utils/calculateDiscount");

const coinpayments_client = new Coinpayments({
  key: process.env.CP_CLIENT_KEY,
  secret: process.env.CP_CLIENT_SECRET,
});

const client_url = process.env.CLIENT_URL || "http://localhost:3000";

exports.createPayment = async function (req, res) {
  const { id } = req.user;
  const { currency, plan_name, partner_discount, discount } = req.body;

  try {
    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).send("Ocurrio un error, intenta nuevamente");
    }

    const { email, name, first_month_payed } = findUserById;

    if (typeof plans.find((plan) => plan.name === plan_name) === "undefined") {
      return res.status(400).json("Ocurrio un error al crear el link de pago");
    }

    let amount = null;
    let ipn_url;

    for (plan of plans) {
      if (plan.name === plan_name) {
        if (first_month_payed)
          amount = calculateDiscount(plan.monthly, discount);
        else amount = calculateDiscount(plan.first_month, discount);
        ipn_url = plan.ipn;
      }
    }

    if (partner_discount && !first_month_payed) {
      amount = amount - (amount * 10) / 100;
    }

    if (amount === null) {
      return res.status(400).json("Ocurrio un error al crear el link de pago");
    }

    const options = {
      currency1: "USD",
      currency2: currency,
      amount,
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
          .json("Ocurrio un error al intentar crear el link de pago");

      return res.status(200).json(response);
    });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.upgradePayment = async function (req, res) {
  try {
    const { id } = req.user;
    const { currency, plan_name, discount } = req.body;

    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).send("Ocurrio un error, intenta nuevamente");
    }

    const { name, email } = findUserById;

    let amount = null;
    let ipn_url;

    for (plan of plans) {
      if (plan.name === plan_name) {
        amount = calculateDiscount(34.99, discount);
        ipn_url = plan.ipn;
      }
    }

    if (amount === null) {
      return res.status(400).json("Ocurrio un error al crear el link de pago");
    }

    const options = {
      currency1: "USD",
      currency2: currency,
      amount,
      buyer_email: email,
      buyer_name: name,
      item_name: plan_name,
      ipn_url,
      success_url: `${client_url}/dashboard`,
      cancel_url: `${client_url}/dashboard`,
    };

    await coinpayments_client.createTransaction(options, (err, response) => {
      if (err)
        return res
          .status(400)
          .json("Ocurrio un error al intentar crear el link de pago");

      return res.status(200).json(response);
    });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
