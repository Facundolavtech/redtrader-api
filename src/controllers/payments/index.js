const User = require("../../models/User");
const Plan = require("../../models/Plan");
const Coinpayments = require("coinpayments");
require("dotenv").config();
const plans = require("../../helpers/Plans");
const {
  CalculatePlanPrice,
  CalculateUpgradePlanPrice,
} = require("../../utils/calculateDiscount");

const coinpayments_client = new Coinpayments({
  key: process.env.CP_CLIENT_KEY,
  secret: process.env.CP_CLIENT_SECRET,
});

const client_url = process.env.CLIENT_URL || "http://localhost:3000";

exports.createPayment = async function (req, res) {
  const { id } = req.user;
  const { currency, plan_name, upgrade } = req.body;

  try {
    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).send("Ocurrio un error, intenta nuevamente");
    }

    const { email, name, referred, first_month_payed, coupon, plan } =
      findUserById;

    if (typeof plans.find((plan) => plan.name === plan_name) === "undefined") {
      return res.status(400).json("Ocurrio un error al crear el link de pago");
    }

    let amount = null;
    let ipn_url;
    let discount = 0;
    let special_discount = 0;

    if (coupon) {
      discount = coupon.discount;
    }

    if (referred && !first_month_payed) {
      special_discount = referred.special_discount;
    }

    if (!upgrade) {
      for (let plan of plans) {
        if (plan.name === plan_name) {
          amount = CalculatePlanPrice(
            plan,
            first_month_payed,
            special_discount,
            discount
          );
          ipn_url = plan.ipn;
        }
      }
    } else {
      const findPlan = await Plan.findById(plan);

      if (!findPlan) {
        return res
          .status(400)
          .json("No puedes actualizar un plan si no tienes uno");
      }

      let actual_plan;
      let difference;

      for (let plan of plans) {
        if (plan.name === findPlan.type) {
          actual_plan = {
            monthly: plan.monthly,
          };
        }
      }

      for (let plan of plans) {
        if (plan.name === plan_name) {
          difference = plan.monthly - actual_plan.monthly;
          ipn_url = plan.ipn;
        }
      }

      amount = CalculateUpgradePlanPrice(
        difference,
        special_discount,
        discount
      );
    }

    if (!amount)
      return res.status(400).json("Ocurrio un error al crear el link de pago");

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
