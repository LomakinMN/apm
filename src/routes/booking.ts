import { Router } from 'express';
import { reserveBooking,createEvent } from '../controllers/bookingController';
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
// добавлен временно в таком кустарном виде и не по месту
router.post('/create',createEvent)

export default router;