import { body } from 'express-validator';

export const bookingValidationRules = [
  body('event_id')
    .isInt({ min: 1 })
    .withMessage('event_id должен быть положительным целым числом')
    .toInt(),

  body('user_id')
    .isLength({ min: 1, max: 20 })
    .withMessage('user_id должен быть от 1 до 20 символов')
    .trim()
    .escape()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('user_id может содержать только буквы, цифры, дефисы и подчеркивания')
];

// от XSS
export const xssSanitizer = (req: any, res: any, next: any) => {
  if (req.body.user_id) {
    req.body.user_id = req.body.user_id.replace(/[<>]/g, '');
  }
  next();
};