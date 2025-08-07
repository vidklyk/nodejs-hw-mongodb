import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import sendEmail from '../../services/email/sendEmail.js';

const { APP_DOMAIN, JWT_SECRET } = process.env;

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const payload = { email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

  const subject = 'Reset your password';
  const html = `
    <p>Hello!</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}" target="_blank">${resetLink}</a>
    <p>This link will expire in 5 minutes.</p>
  `;

  try {
    await sendEmail(email, subject, html);
  } catch (error) {
    console.error('Email error:', error.message);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};
