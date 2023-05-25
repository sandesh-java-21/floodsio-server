const Item = require("../models/Item");

const { uploadImageToCloudinary } = require("../utils/Cloudinary");

const createItem = async (req, res) => {
  try {
    var { name, description, price, quantity, imageBase64, vendor, category } =
      req.body;

    if (
      !name ||
      name === "" ||
      !description ||
      description === "" ||
      !price ||
      price < 0 ||
      !quantity ||
      quantity < 0 ||
      !imageBase64 ||
      imageBase64 === "" ||
      !vendor ||
      vendor === ""
    ) {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      uploadImageToCloudinary(imageBase64)
        .then(async (onImageUpload) => {
          console.log("on image upload: ", onImageUpload);

          const item = new Item({
            name,
            description,
            price,
            quantity,
            image: {
              url: onImageUpload.secure_url,
              public_id: onImageUpload.public_id,
            },
            vendor,
            is_in_need: false,
            category,
          });

          var savedItem = item.save().then((onItemSave) => {
            console.log("on item save: ", onItemSave);
            res.json({
              message: "New Item Added!",
              status: "200",
              savedItem: onItemSave,
            });
          });
        })
        .catch(async (onImageUploadError) => {
          console.log("on image upload error: ", onImageUploadError);
          res.json({
            message: "Something went wrong while uploading image to cloud!",
            status: "400",
            error: onImageUploadError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

module.exports = {
  createItem,
};
