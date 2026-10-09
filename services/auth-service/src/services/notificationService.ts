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


export const sendFinalApplicationEmail = async (
    toEmail: string,
    studentName: string,
    status: string,
    remarks: string
) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: `ScholarEase: Application ${status}`,
            text: `Hello ${studentName},

Your scholarship application has been ${status}.

Admin Remarks: ${remarks || "No additional remarks provided."}

Please log in to your ScholarEase dashboard to check your application status.

Regards,
ScholarEase Team`,
        });

        console.log("Final application email sent to:", toEmail);
    } catch (error) {
        console.error("Final application email failed:", error);
        throw error;
    }
};