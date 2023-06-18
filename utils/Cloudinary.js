const cloudinary = require("cloudinary").v2;
const { cloudConfig } = require("../Config");

function uploadImageToCloudinary(base64Image, folder = "user-profiles") {
  cloudinary.config(cloudConfig);

  return new Promise((resolve, reject) => {
    // Upload the image to Cloudinary
    cloudinary.uploader.upload(
      base64Image,
      {
        folder: folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = {
  uploadImageToCloudinary,
};
