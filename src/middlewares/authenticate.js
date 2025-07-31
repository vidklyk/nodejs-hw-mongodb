import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../models/session.model.js';
import User from '../models/user.model.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Access token is missing or invalid');
    }

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const session = await Session.findOne({
      userId: payload.userId,
      accessToken: token,
    });
    if (!session || session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Session is invalid or expired');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;
