import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({ //mtlb file ko hardisk m save krna h 

    destination: function (req, file, cb) {
        cb(null, "uploads/");  //File uploads folder m save kro
    },

    filename: function (req, file, cb) { //man lo upload file ka naam adhar.pdf h pr save hoga 171887777-aadhaar.pdf taaki dupicate clash naa ho
        cb(null, Date.now() + "-" + file.originalname);
    },

});

const upload = multer({ storage }); //multer ko ham bol rhe h ye rule use kre 



//Test Route      //ek file expect kr rha h
router.post( "/", upload.single("document"), (req, res) => {

        return res.status(200).json({
            success: true,
            message: "File Uploaded Successfully",
            file: req.file,
        });

    }
);

export default router;