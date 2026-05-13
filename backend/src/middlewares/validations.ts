import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'
import { Types } from 'mongoose'

export const phoneRegExp = /^\+?[\d\s\-().]+$/

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

const sendValidationError = (res: Response, message: string) => {
    res.status(400).json({ message })
}

export const validateOrderBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        items: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (Types.ObjectId.isValid(value)) {
                        return value
                    }
                    return helpers.message({ custom: 'Невалидный id' })
                })
            )
            .messages({ 'array.empty': 'Не указаны товары' }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'any.only':
                    'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
                'string.empty': 'Не указан способ оплаты',
            }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Не указан email',
        }),
        phone: Joi.string().required().pattern(phoneRegExp).messages({
            'string.empty': 'Не указан телефон',
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Не указан адрес',
        }),
        total: Joi.number().required().messages({
            'number.base': 'Не указана сумма заказа',
        }),
        comment: Joi.string().optional().allow(''),
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return sendValidationError(res, error.details[0].message)
    }
    return next()
}

export const validateProductBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
            'string.empty': 'Поле "title" должно быть заполнено',
        }),
        image: Joi.object({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string().required().messages({
            'string.empty': 'Поле "category" должно быть заполнено',
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Поле "description" должно быть заполнено',
        }),
        price: Joi.number().allow(null),
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return sendValidationError(res, error.details[0].message)
    }
    return next()
}

export const validateProductUpdateBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        image: Joi.object({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string(),
        description: Joi.string(),
        price: Joi.number().allow(null),
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return sendValidationError(res, error.details[0].message)
    }
    return next()
}

export const validateObjId = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        productId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ custom: 'Невалидный id' })
            }),
    })

    const { error } = schema.validate(req.params)
    if (error) {
        return sendValidationError(res, error.details[0].message)
    }
    return next()
}

export const validateUserBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
            }),
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return sendValidationError(res, error.details[0].message)
    }
    return next()
}

export const validateAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.required': 'Поле "email" должно быть заполнено',
            }),
        password: Joi.string().required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return sendValidationError(res, error.details[0].message)
    }
    return next()
}