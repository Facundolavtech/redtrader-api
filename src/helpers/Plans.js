module.exports = [
  {
    name: "Plan Premium",
    first_month: 70,
    monthly: 50,
    ipn: `${process.env.IPN_URL}/premium`,
  },
  {
    name: "Plan Premium Plus",
    first_month: 99,
    monthly: 70,
    ipn: `${process.env.IPN_URL}/premium_plus`,
  },
];
