const nodemailer = require("nodemailer");

const generateRandomPassword = () => {
  var password = Math.floor(Math.random() * (1000000000 - 1) + 1);

  console.log("random digits: ", password);
  return password;
};

function sendOTPByEmail(email) {
  return new Promise((resolve, reject) => {
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: "2525",
      auth: {
        user: "floodsio17@gmail.com",
        pass: "ukuppoayzqebzsjy",
      },
    });

    // Configure the email options
    const mailOptions = {
      from: "OTP-VERIFICATION-NO-REPLY floodsio17@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP: ${otp}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error); // If there's an error, reject the promise
      } else {
        resolve(otp); // If the email is sent successfully, resolve the promise with the OTP
      }
    });
  });
}

function isVendorIdAvailable(arr, vendorId) {
  for (let i = 0; i < arr.length; i++) {
    console.log("vendor function: ", arr[i].vendor.toString(), vendorId);

    if (arr[i].vendor.toString() !== vendorId.toString()) {
      console.log("here");
      return true; // Vendor ID found
    }
  }
  return false; // Vendor ID not found
}

module.exports = {
  generateRandomPassword,
  sendOTPByEmail,
  isVendorIdAvailable,
};
