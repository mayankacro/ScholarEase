import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export default cloudinary;


//"We created a separate Cloudinary configuration file to centralize the Cloudinary setup. 
// This avoids code duplication and allows us to use a single configured 
// Cloudinary instance throughout the application."