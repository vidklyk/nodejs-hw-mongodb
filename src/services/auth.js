import jwt from 'jsonwebtoken';
import Session from '../models/session.model.js';
import User from '../models/user.model.js';
import createHttpError from 'http-errors';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token missing');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch {
    throw createHttpError(403, 'Invalid refresh token');
  }

  const session = await Session.findOne({ refreshToken }).exec();
  if (!session) {
    throw createHttpError(403, 'Session not found');
  }

  await Session.findByIdAndDelete(session._id);

  const user = await User.findById(payload.userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const accessToken = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const newRefreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  const now = new Date();

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(now.getTime() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
