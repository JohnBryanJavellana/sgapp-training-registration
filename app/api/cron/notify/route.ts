import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

// 3
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const { searchParams } = new URL(request.url);
        const querySecret = searchParams.get('secret');

        const expectedSecret = process.env.CRON_SECRET;
        const isHeaderValid = authHeader === `Bearer ${expectedSecret}`;
        const isQueryValid = querySecret === expectedSecret;

        if (!isHeaderValid && !isQueryValid) {
            return new NextResponse('Unauthorized: Invalid Credentials', { status: 401 });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = "14y13pck9v2jfQjyxjrrQ-TROseqsdTpxM6Vpc-vP9ro";

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A:K',
        });

        const rows = response.data.values;
        if (!rows || rows.length <= 1) {
            return NextResponse.json({ success: true, message: 'No new registration data found.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const fname = row[0] ?? '';
            const mname = row[1] ?? '';
            const lname = row[2] ?? '';
            const email = row[3] ?? '';
            const sex = row[4] ?? '';
            const age = row[5] ?? '';
            const work = row[6] ?? '';
            const address = row[7] ?? '';
            const contact = row[8] ?? '';
            const selectedRequestType = row[9] ?? '';
            const registeredAtStr = row[10] ?? '';
            const notificationStatus = row[11] ?? '';

            if (!registeredAtStr || notificationStatus === 'YES') continue;

            const registrationTime = new Date(registeredAtStr);
            const currentTime = new Date();
            const timeDifferenceInMs = currentTime.getTime() - registrationTime.getTime();
            const twoHoursInMs = 2 * 60 * 60 * 1000;

            if (timeDifferenceInMs < twoHoursInMs) {
                continue;
            }

            await transporter.sendMail({
                from: `"SGAPP Registration" <${process.env.EMAIL_USER}>`,
                to: email?.toString(),
                subject: 'Registration Confirmed!',
                html: `
                    <!DOCTYPE html>
                    <html>
                        <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Registration Confirmed</title>
                        <style>
                            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
                            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); border: 1px solid #e5e7eb; }
                            .banner { width: 100%; max-width: 600px; height: auto; display: block; border: 0; }
                            .content { padding: 32px; }
                            .accent-heading { font-size: 24px; font-weight: 800; color: #ea580c; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 16px 0; }
                            h1 { font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 20px 0; line-height: 1.4; }
                            p { font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; }
                            .details-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
                            .details-title { font-size: 14px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
                            .table-row td { padding: 6px 0; font-size: 14px; line-height: 1.5; vertical-align: top; }
                            .label { font-weight: 600; color: #6b7280; width: 120px; }
                            .value { color: #111827; font-weight: 500; }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <img src="https://sgapp-training-registration.vercel.app//assets/738774557_10164735419234244_596011779044760202_n2.png" alt="SGAPP Registration Banner" class="banner" />

                            <div class="content">
                                <div class="accent-heading">CONGRATULATIONS!</div>
                                <h1>You are now officially registered for the SGAPP Event.</h1>

                                <p>Your registration has been successfully confirmed and your details have been logged. We are thrilled to welcome you to this year's event bringing together dedicated professionals, industry leaders, and valued partners.</p>
                                <p>Get ready for an engaging experience filled with insightful presentations, strategic discussions, and valuable professional networking opportunities.</p>

                                <div class="details-box">
                                    <div class="details-title">Your Registration Summary</div>
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                        <tr class="table-row">
                                            <td class="label">Name:</td>
                                            <td class="value">${[fname, mname, lname].filter(Boolean).join(' ')}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">Phone:</td>
                                            <td class="value">${contact}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">Job Title:</td>
                                            <td class="value">${sex}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">age:</td>
                                            <td class="value">${age}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">work:</td>
                                            <td class="value">${work}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">address:</td>
                                            <td class="value">${address}</td>
                                        </tr>
                                        <tr class="table-row">
                                            <td class="label">Payment option:</td>
                                            <td class="value">${selectedRequestType}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        </body>
                    </html>
                `
            });

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `Sheet1!J${i + 1}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [["YES"]],
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cron Error:', error);
    }
}