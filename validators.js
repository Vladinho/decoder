import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Email is not valid').isEmail(),
    body('password', 'Min length is 5').isLength({ min: 5 }),
    body('fullName', 'Min length is 3').isLength({ min: 3 }),
    body('avatarUrl', 'Url is not valid').optional().isURL(),
]