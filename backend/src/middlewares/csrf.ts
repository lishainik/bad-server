import Tokens from 'csrf'
import { NextFunction, Request, Response } from 'express'
import ForbiddenError from '../errors/forbidden-error'

const tokens = new Tokens()
const SECRET = process.env.CSRF_SECRET || 'csrf-secret-dev'

export const getCsrfToken = (_req: Request, res: Response) => {
    const token = tokens.create(SECRET)
    res.cookie('_csrf', token, {
        httpOnly: false,
        sameSite: 'lax',
        secure: false,
        path: '/',
    })
    res.json({ csrfToken: token })
}

export const validateCsrfToken = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const csrfToken =
        (req.headers['x-csrf-token'] as string) ||
        (req.cookies && req.cookies._csrf) ||
        (req.body && req.body.csrfToken)

    if (!csrfToken || !tokens.verify(SECRET, csrfToken)) {
        return next(new ForbiddenError('Невалидный CSRF токен'))
    }

    return next()
}