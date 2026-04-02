import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired access token' });
  }
};
