
import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendEmail = async (
    toEmail: string,
    subject: string,
    textContent: string
) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "ScholarEase";

    if (!apiKey || !senderEmail) {
        throw new Error("Brevo email configuration is missing");
    }

    const response = await axios.post(
        BREVO_API_URL,
        {
            sender: {
                name: senderName,
                email: senderEmail,
            },
            to: [{ email: toEmail }],
            subject,
            textContent,
        },
        {
            headers: {
                "api-key": apiKey,
                "Content-Type": "application/json",
                accept: "application/json",
            },
            timeout: 15000,
        }
    );

    console.log("Brevo accepted email:", response.data.messageId);
    return response.data;
};

export const sendStatusEmail = async (
    toEmail: string,
    documentType: string,
    aiStatus: string,
    aiRemarks: string
) => {
    try {
        await sendEmail(
            toEmail,
            `Document Status: ${documentType}`,
            `Status: ${aiStatus}\nRemarks: ${aiRemarks}`
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                "Document status email failed:",
                error.response?.data || error.message
            );
        } else {
            console.error("Document status email failed:", error);
        }
    }
};

export const sendFinalApplicationEmail = async (
    toEmail: string,
    studentName: string,
    status: string,
    remarks: string
) => {
    try {
        await sendEmail(
            toEmail,
            `ScholarEase: Application ${status}`,
            `Hello ${studentName},

Your scholarship application has been ${status}.

Admin Remarks: ${remarks || "No additional remarks provided."}

Please log in to your ScholarEase dashboard to check your application status.

Regards,
ScholarEase Team`
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                "Final application email failed:",
                error.response?.data || error.message
            );
        } else {
            console.error("Final application email failed:", error);
        }

        throw error;
    }
};
