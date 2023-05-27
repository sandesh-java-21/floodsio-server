const generateRandomPassword = () => {
  var password = Math.floor(Math.random() * (1000000000 - 1) + 1);

  console.log("random digits: ", password);
  return password;
};

module.exports = {
  generateRandomPassword,
};
