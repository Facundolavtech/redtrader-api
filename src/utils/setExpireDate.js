module.exports = function (number_of_months) {
  const date = new Date();

  return date.setDate(date.getDate() + 30 * number_of_months);
};
