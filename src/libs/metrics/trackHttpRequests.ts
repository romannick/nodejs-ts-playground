import { httpRequestDurationMicroseconds } from './promMetrics'
import { Request, Response, NextFunction } from 'express'

export const trackHttpRequests = (req: Request, res: Response, next: NextFunction) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = req.route?.path || req.path;

  res.on('finish', () => {
    end({ method: req.method, route, status_code: res.statusCode });
  });

  next();
};