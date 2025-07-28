import nodemailer from 'nodemailer';
import mjml2html from 'mjml';

export const sendEmail = async (to, subject, mjmlTemplate) => {
    const htmlOutput = mjml2html(mjmlTemplate);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `Link in Bio App`,
        to,
        subject,
        html: htmlOutput.html,
    });
};
