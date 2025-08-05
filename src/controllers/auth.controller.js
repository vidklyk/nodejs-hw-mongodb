import { register, login, refreshSession } from '../services/auth.js';
import createHttpError from 'http-errors';
import Session from '../models/session.model.js';

export const registerController = async (req, res) => {
  const newUser = await register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  });
};

export const loginController = async (req, res) => {
  const { accessToken, refreshToken } = await login(req.body);

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken, refreshToken },
    });
};

export const refreshSessionController = async (req, res) => {
  let refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');
    if (type === 'Bearer' && token) {
      refreshToken = token;
    }
  }

  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token missing');
  }

  const { accessToken, refreshToken: newRefreshToken } = await refreshSession(
    refreshToken,
  );

  res
    .cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken, refreshToken: newRefreshToken },
    });
};

export const logoutUserController = async (req, res) => {
  let refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');
    if (type === 'Bearer' && token) {
      refreshToken = token;
    }
  }

  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not found');
  }

  await Session.findOneAndDelete({ refreshToken });

  res.clearCookie('refreshToken');
  res.status(204).send();
};
