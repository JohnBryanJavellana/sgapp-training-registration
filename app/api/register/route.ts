import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const fname = formData.get('fname');
        const mname = formData.get('mname');
        const lname = formData.get('lname');
        const email = formData.get('email');
        const job_title = formData.get('job_title');
        const agency = formData.get('agency');
        const contact = formData.get('contact');
        const selectedRequestType = formData.get('selectedRequestType');
        const paymentFile = formData.get('paymentFile');

        if (!paymentFile) {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const file = paymentFile as File;
        const sheets = google.sheets({ version: 'v4', auth });
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!D:D',
        });

        const existingEmails = response.data.values;

        if (existingEmails) {
            const emailExists = existingEmails.flat().some(
                (existingEmail) => existingEmail?.toString().toLowerCase() === email?.toString().toLowerCase()
            );

            if (emailExists) {
                return NextResponse.json(
                    { error: 'This email address has already been registered.' },
                    { status: 400 }
                );
            }
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:J',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    fname,
                    mname,
                    lname,
                    email,
                    job_title,
                    agency,
                    selectedRequestType,
                    contact,
                    new Date().toISOString(),
                    "NO"
                ]],
            },
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Mikrotik Registration" <${process.env.EMAIL_USER}>`,
            to: process.env.NOTIFICATION_EMAIL,
            subject: 'New Registration Created!',
            html: `
                    <!DOCTYPE html>
                    <html>
                        <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>New Registration Notification</title>
                        <style>
                            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
                            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
                            .banner { width: 100%; max-width: 600px; height: auto; display: block; border: 0; }
                            .content { padding: 32px; }
                            .accent-heading { font-size: 22px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0; }
                            h1 { font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px 0; line-height: 1.4; }
                            p { font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; }
                            .details-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
                            .details-title { font-size: 14px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
                            .table-row td { padding: 6px 0; font-size: 14px; line-height: 1.5; vertical-align: top; }
                            .label { font-weight: 600; color: #6b7280; width: 120px; }
                            .value { color: #111827; font-weight: 500; }
                            .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 13px; color: #1e40af; background: #eff6ff; padding: 12px; border-radius: 6px; text-align: center; font-weight: 600; }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <img src="https://mikrotik-registration-omega.vercel.app/assets/738774557_10164735419234244_596011779044760202_n.jpg" alt="Mikrotik Registration Banner" class="banner" />

                            <div class="content">
                                <div class="accent-heading">REGISTRATION ALERT</div>
                                <h1>A new attendee has registered for the Mikrotik Event.</h1>
                                <p>The system has logged a new entry. Review the registration details below. The uploaded proof of payment has been attached directly to this notification message.</p>

                                <div class="details-box">
                                    <div class="details-title">Attendee Information Summary</div>
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                        <tr class="table-row">
                                            <td class="label">Name:</td>
                                            <td class="value">${[fname, mname, lname].filter(Boolean).join(' ')}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">Email:</td>
                                            <td class="value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">Phone:</td>
                                            <td class="value">${contact}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">Job Title:</td>
                                            <td class="value">${job_title}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">Agency:</td>
                                            <td class="value">${agency}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">Category:</td>
                                            <td class="value">${selectedRequestType}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <div class="footer">
                                    📎 The attendee's proof of payment is attached below.
                                </div>
                            </div>
                        </div>
                        </body>
                    </html>
                `,
            attachments: [
                {
                    filename: file.name || 'proof_of_payment.png',
                    content: buffer,
                }
            ]
        });

        return NextResponse.json({ message: 'Success' }, { status: 200 });

    } catch (error) {
        console.log('Registration Error:', error);
        return NextResponse.json({ error: `Something went wrong.` }, { status: 500 });
    }
}