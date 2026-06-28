import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendStatusEmail = async (toEmail: string, documentType: string, aiStatus: string, aiRemarks: string) => {
    try{
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: `Document Status : ${documentType}`,
            text: `Status: ${aiStatus}\nRemarks: ${aiRemarks}`,
        });

        console.log("Email sent to : ", toEmail);

    } catch (error){
        console.log("Email failed: ", error);
    }
};