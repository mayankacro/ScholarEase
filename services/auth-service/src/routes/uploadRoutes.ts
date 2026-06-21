import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

const router = express.Router();

const storage = multer.memoryStorage();  //ram memory

const upload = multer({ storage }); //multer ko ham bol rhe h ye rule use kre 

router.post("/", upload.single("document"), async(req, res) => {
    try{

        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const result = await new Promise<any>((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "ScholarEase",
                    resource_type: "auto",
                },

                (error: any, result: any) => {
                    if(error) {
                        reject(error);
                    }else {
                        resolve(result);
                    }
                }
            );

            streamifier
                .createReadStream(req.file!.buffer)
                .pipe(stream);
        });

        return res.status(200).json({
            success: true,
            url: result.secure_url,
        });

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Upload Failed"
        });

    }
});

// const storage = multer.diskStorage({ //mtlb file ko hardisk m save krna h 

//     destination: function (req, file, cb) {
//         cb(null, "uploads/");  //File uploads folder m save kro
//     },

//     filename: function (req, file, cb) { //man lo upload file ka naam adhar.pdf h pr save hoga 171887777-aadhaar.pdf taaki dupicate clash naa ho
//         cb(null, Date.now() + "-" + file.originalname);
//     },

// });





//Test Route      //ek file expect kr rha h
// router.post( "/", upload.single("document"), (req, res) => {

//         return res.status(200).json({
//             success: true,
//             message: "File Uploaded Successfully",
//             file: req.file,
//         });

//     }
// );

export default router;