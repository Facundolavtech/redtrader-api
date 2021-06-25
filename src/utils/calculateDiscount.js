exports.CalculateUpgradePlanPrice = function (
  difference,
  special_discount,
  discount
) {
  let totalDiscount = special_discount + discount;
  if (totalDiscount > 99) totalDiscount = 99;

  const total = (difference - (difference * totalDiscount) / 100).toFixed(2);

  return total;
};

exports.CalculatePlanPrice = function (
  plan,
  first_month_payed,
  special_discount,
  discount
) {
  let price;

  if (first_month_payed) price = plan.monthly;
  else price = plan.first_month;

  let totalDiscount = special_discount + discount;
  if (totalDiscount > 99) totalDiscount = 99;

  const total = (price - (price * totalDiscount) / 100).toFixed(2);

  return total;
};
