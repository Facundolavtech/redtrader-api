function calculateDiscount(price, discount) {
  const priceWithDiscount = (price - (price * discount) / 100).toFixed(2);

  return priceWithDiscount;
}

module.exports = calculateDiscount;
