import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, org, role, industry, challenge } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const htmlContent = `
      <h2>New AI Readiness Assessment Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Organisation:</strong> ${org || "N/A"}</p>
      <p><strong>Role/Title:</strong> ${role || "N/A"}</p>
      <p><strong>Industry:</strong> ${industry || "N/A"}</p>
      <p><strong>Challenge/Vision:</strong></p>
      <blockquote style="background: #f4f4f4; padding: 10px; border-left: 4px solid #c8893a;">
        ${challenge || "N/A"}
      </blockquote>
    `;

    const data = await resend.emails.send({
      from: process.env.CONTACT_FORM_FROM_EMAIL || "hello@berryxsystems.com",
      to: process.env.CONTACT_FORM_TO_EMAIL || "berryxsystems@gmail.com",
      subject: `New Assessment Request from ${name} (${org || "BerryX Systems"})`,
      html: htmlContent,
      replyTo: email, // So you can hit "reply" in Gmail and it goes to the user
    });

    // 2. Send an automated "Thank You" email back to the user
    const userHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #060806; padding: 35px 40px; text-align: center;">
              <span style="color: #c8893a; font-size: 18px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase;">BERRYX SYSTEMS</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 45px 40px;">
              <h1 style="color: #111827; font-size: 24px; font-weight: 300; margin-top: 0; margin-bottom: 24px; font-family: Georgia, serif;">Assessment Request Received</h1>
              
              <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
                Dear ${name},
              </p>
              
              <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
                Thank you for requesting an AI Readiness Assessment with BerryX Systems. We have successfully received your details regarding the operational challenges at <strong>${org || "your organization"}</strong>.
              </p>
              
              <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin-bottom: 30px;">
                Our intelligent systems architects are currently reviewing your operational requirements. A member of our enterprise team will contact you shortly to schedule your zero-commitment advisory session.
              </p>
              
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 35px;">
                <tr>
                  <td align="left" style="border-radius: 4px; background-color: #060806;">
                    <a href="https://berryxsystems.com" target="_blank" style="font-size: 13px; font-weight: 500; color: #ffffff; text-decoration: none; padding: 14px 28px; display: inline-block; border-radius: 4px; letter-spacing: 1.5px; text-transform: uppercase;">Visit Our Hub</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin-bottom: 0;">
                Best regards,<br>
                <strong style="color: #111827;">The BerryX Systems Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 0; letter-spacing: 0.5px;">
                &copy; ${new Date().getFullYear()} BerryX Systems. All rights reserved.<br>
                Industrial Intelligence for Complex Environments.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await resend.emails.send({
      from: process.env.CONTACT_FORM_FROM_EMAIL || "hello@berryxsystems.com",
      to: email, // Send to the person who filled out the form
      subject: "Your BerryX Systems AI Assessment Request",
      html: userHtmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
