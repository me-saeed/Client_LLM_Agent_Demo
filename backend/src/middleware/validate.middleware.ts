/**
 * Request validation middleware.
 *
 * Wraps Yup schemas as Express middleware so routes can validate
 * `body`, `params`, or `query` before the controller runs.
 */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnyObjectSchema, ValidationError } from 'yup';

/** Which part of the Express request object to validate. */
type RequestSource = 'body' | 'query' | 'params';

/**
 * Builds an Express middleware that validates a request slice with a Yup schema.
 *
 * On success, the validated (and stripped) value replaces `req[source]`.
 * On failure, responds with HTTP 400 and a list of validation error messages.
 *
 * @param schema - Yup object schema to validate against.
 * @param source - Request property to validate. Defaults to `body`.
 * @returns Express middleware function.
 */
export const validate = (schema: AnyObjectSchema, source: RequestSource = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });
      req[source] = value;
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
