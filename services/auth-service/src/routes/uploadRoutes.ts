import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

const router = express.Router();

const storage = multer.memoryStorage();  //file -> RAM memory m temporaril save krenge

const upload = multer({ storage }); //multer ko ham bol rhe h ye rule use kre -> jo bhi file aaye use memmory m rkhna 

router.post("/", upload.single("document"), async (req, res) => { //upload.single("document") -> multer middleware -> iska mtlb request m ek hi file accept kro or file ka key hona chahiye "document"
    try {

        if (!req.file) { // agr koi file upload nahi hui ho to
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const result = await new Promise<any>((resolve, reject) => { //Cloudinary callback use karta hai -> lekin hum await use krna chahte h -> isliye callback ko promise m convert kia 

            const stream = cloudinary.uploader.upload_stream( //ye cloudinary ko bolta hai -> Main tumhe ek file stream bhejunga. Usse upload kar dena.
                {
                    folder: "ScholarEase", //mtlb scholarEase folder m save kro
                    resource_type: "auto", //or pdf,docx, png jo bhi ho automatic detect kro
                },

                (error: any, result: any) => {  //Cloudinary upload complete hone ke baad ye callback chalega
                    if (error) {
                        reject(error); //if not uploades error
                    } else {
                        resolve(result); // agr uploaded 
                    }
                }
            );

            streamifier
                .createReadStream(req.file!.buffer) //req.file.buffer -> Ram m rkhu hui file  || createReadStream() -> File ko ek stream me convert karta hai
                //mtlb puri file ek sath nahi bhejenge thoda thoda data bhejenge
                .pipe(stream); //ye chunks cloudinary ko bhej do
        });

        return res.status(200).json({  //cline ko permanent URL mil gya
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