module.exports = function (emailFrom, emailTo, subject, html) {
  return {
    from: emailFrom,
    to: emailTo,
    subject,
    html,
  };
};
