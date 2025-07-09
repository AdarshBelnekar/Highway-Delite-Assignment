
import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';


export interface AuthenticatedRequest extends Request {
  userId?: string; // Will be set after token verification
}


const authenticateJWT = (
  req: AuthenticatedRequest,  // Our custom request with `userId`
  res: Response,
  next: NextFunction
): void => {
  // Get the token from the headers (we're using a custom 'token' header)
  const token = req.headers.token as string;

  // If no token is present, return 401 Unauthorized
  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  try {
    // Verify the token using the JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
      id: string;      // Assuming payload contains `id`
      email: string;   // and `email`
    };

    // Attach the userId (extracted from token) to the request object
    req.userId = decoded.id;

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, return 403 Forbidden
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
};


export default authenticateJWT;
