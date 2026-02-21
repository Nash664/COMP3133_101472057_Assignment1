const cloudinary = require("cloudinary").v2;

const initCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars are missing");
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });

  return cloudinary;
};

const uploadEmployeePhoto = async (dataUriOrUrl) => {
  const result = await cloudinary.uploader.upload(dataUriOrUrl, {
    folder: "comp3133/employees",
    resource_type: "image"
  });

  return {
    public_id: result.public_id,
    secure_url: result.secure_url
  };
};

module.exports = { initCloudinary, uploadEmployeePhoto };
