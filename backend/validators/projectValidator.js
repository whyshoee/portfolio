import { body } from 'express-validator';

export const validateProject = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('cat').trim().notEmpty().withMessage('Category is required'),
  body('featured').optional().isBoolean()
];