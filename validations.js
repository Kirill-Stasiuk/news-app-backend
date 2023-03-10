import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Password must be have 5 symbols minimum').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Password must be have 5 symbols minimum').isLength({ min: 5 }),
    body('fullName', 'Enter your name').isLength({ min: 3 }),
    body('avatarUrl', 'Invalid link on avatar').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter post title').isLength({ min: 3 }).isString(),
    body('text', 'Enter post text').isLength({ min: 10 }).isString(),
    body('tags', 'Incorrect format of tags').optional().isString(),
    body('imageUrl', 'Invalid link on image').optional().isString(),
];

export const commentCreateValidation = [
    body('comment', 'Enter comment').isLength({ min: 3 }).isString()
]
