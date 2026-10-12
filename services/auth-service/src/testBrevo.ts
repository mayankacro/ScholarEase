
// import "dotenv/config";
// import axios from "axios";

// async function testBrevo() {
//     const apiKey = process.env.BREVO_API_KEY;
//     const senderEmail = process.env.BREVO_SENDER_EMAIL;

//     if (!apiKey || !senderEmail) {
//         throw new Error("Brevo environment variables are missing");
//     }

//     const response = await axios.post(
//         "https://api.brevo.com/v3/smtp/email",
//         {
//             sender: {
//                 name: "ScholarEase",
//                 email: senderEmail,
//             },
//             to: [{ email: "babariyamayank07@gmail.com" }],
//             subject: "ScholarEase Brevo Test",
//             textContent: "Bhai, ScholarEase Brevo integration working hai!",
//         },
//         {
//             headers: {
//                 "api-key": apiKey,
//                 "Content-Type": "application/json",
//                 accept: "application/json",
//             },
//             timeout: 15000,
//         }
//     );

//     console.log("Brevo accepted email:", response.data);
// }

// testBrevo().catch((error) => {
//     console.error(
//         "Brevo test failed:",
//         error.response?.data || error.message
//     );
//     process.exitCode = 1;
// });


import axios from "axios";

type DocStatus = "approved" | "rejected";

export async function sendStatusEmail(
  to: string,
  studentName: string,
  status: DocStatus
) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    throw new Error("Brevo email configuration is missing");
  }

  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: "ScholarEase", email: senderEmail },
      to: [{ email: to, name: studentName }],
      subject: `Your document was ${status}`,
      textContent: `Hi ${studentName}, your document has been ${status} by the admin.`,
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

  return response.data;
}