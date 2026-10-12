
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "ScholarEase <onboarding@resend.dev>";

export const sendStatusEmail = async (
    toEmail: string,
    documentType: string,
    aiStatus: string,
    aiRemarks: string
) => {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [toEmail],
            subject: `Document Status: ${documentType}`,
            text: `Status: ${aiStatus}\nRemarks: ${aiRemarks}`,
        });

        if (error) {
            console.error("Email failed:", error);
            return;
        }

        console.log("Document status email accepted:", data?.id);
    } catch (error) {
        console.error("Email failed:", error);
    }
};

export const sendFinalApplicationEmail = async (
    toEmail: string,
    studentName: string,
    status: string,
    remarks: string
) => {
    const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [toEmail],
        subject: `ScholarEase: Application ${status}`,
        text: `Hello ${studentName},

Your scholarship application has been ${status}.

Admin Remarks: ${remarks || "No additional remarks provided."}

Please log in to your ScholarEase dashboard to check your application status.

Regards,
ScholarEase Team`,
    });

    if (error) {
        console.error("Final application email failed:", error);
        throw error;
    }

    console.log("Final application email accepted:", data?.id);
};
