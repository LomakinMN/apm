import { Router } from 'express';
import { reserveBooking } from '../controllers/bookingController';
import { bookingValidationRules, xssSanitizer } from '../validators/bookingValidator';
import { bookingRateLimiter } from '../middleware/security';

const router = Router();

router.post(
  '/reserve',
  bookingRateLimiter, 
  bookingValidationRules,
  xssSanitizer,
  reserveBooking
);

export default router;