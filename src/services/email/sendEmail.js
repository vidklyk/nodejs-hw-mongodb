import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
  process.env;

const port = Number(SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = { from: SMTP_FROM, to, subject, html };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    const reason = err?.response || err?.message || 'Mail send failed';
    throw new Error(`SMTP_SEND_FAILED: ${reason}`);
  }
};

export default sendEmail;
