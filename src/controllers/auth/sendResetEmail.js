import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import sendEmail from '../../services/email/sendEmail.js';
const { APP_DOMAIN, JWT_SECRET } = process.env;

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found!');

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });

    const base = APP_DOMAIN.replace(/\/+$/, '');
    const resetLink = `${base}/reset-password?token=${encodeURIComponent(
      token,
    )}`;

    const subject = 'Reset your password';
    const html = `
      <p>Hello!</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}" target="_blank" rel="noopener">${resetLink}</a></p>
      <p>This link will expire in 5 minutes.</p>
    `;

    try {
      await sendEmail(email, subject, html);
    } catch (err) {
      console.error('Email error:', err);
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    }

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
