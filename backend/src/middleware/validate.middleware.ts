import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnyObjectSchema, ValidationError } from 'yup';

type RequestSource = 'body' | 'query' | 'params';

const setValidatedValue = (req: Request, source: RequestSource, value: unknown) => {
  if (source === 'query') {
    Object.defineProperty(req, 'query', {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    return;
  }

  req[source] = value;
};

export const validate = (schema: AnyObjectSchema, source: RequestSource = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });
      setValidatedValue(req, source, value);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};
