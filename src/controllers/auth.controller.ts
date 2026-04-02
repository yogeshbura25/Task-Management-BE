import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    res.status(201).json({ status: 'success', message: 'User registered successfully', data: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email } // do not send password
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
       return res.status(401).json({ status: 'error', message: 'Refresh token required' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }

    const newAccessToken = generateAccessToken(user.id);
    res.status(200).json({ status: 'success', data: { accessToken: newAccessToken } });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  // In a more complex app, we might blacklist the refresh token in the DB or Redis.
  // For now, client-side removal of the token is sufficient.
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};
