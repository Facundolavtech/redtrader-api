module.exports = [
  {
    name: "premium",
    first_month: 70,
    monthly: 50,
    ipn: `${process.env.IPN_URL}/premium`,
  },
  {
    name: "premium_plus",
    first_month: 99,
    monthly: 70,
    ipn: `${process.env.IPN_URL}/premium_plus`,
  },
];
