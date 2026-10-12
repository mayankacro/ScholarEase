
import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    const { data, error } = await resend.emails.send({
        from: "ScholarEase <onboarding@resend.dev>",
        to: ["mayankbabariya06@gmail.com"],
        subject: "ScholarEase Email Test",
        text: "Bhai, Resend email integration working hai!",
    });

    if (error) {
        console.error("Resend email failed:", error);
        return;
    }

    console.log("Resend email accepted:", data);
}

testEmail().catch(console.error);
