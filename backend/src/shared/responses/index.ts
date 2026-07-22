import { Response } from 'express';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../constants';

export interface StandardResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta: unknown;
  errors: unknown[];
  requestId: string;
  timestamp: string;
  code?: string;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null = null,
  meta: unknown = null,
  errors: unknown[] = [],
  code?: string
): Response => {
  const requestId = res.req?.context?.requestId || 'N/A';
  const responsePayload: StandardResponse<T> = {
    success,
    message,
    data,
    meta,
    errors,
    requestId,
    timestamp: new Date().toISOString(),
  };

  if (code) {
    responsePayload.code = code;
  }

  return res.status(statusCode).json(responsePayload);
};

export const success = <T>(
  res: Response,
  message: string = RESPONSE_MESSAGES.SUCCESS,
  data: T | null = null,
  meta: unknown = null
): Response => {
  return sendResponse(res, HTTP_STATUS.OK, true, message, data, meta);
};

export const created = <T>(
  res: Response,
  message: string = RESPONSE_MESSAGES.CREATED,
  data: T | null = null
): Response => {
  return sendResponse(res, HTTP_STATUS.CREATED, true, message, data);
};

export const badRequest = (
  res: Response,
  message: string = RESPONSE_MESSAGES.BAD_REQUEST,
  errors: unknown[] = []
): Response => {
  return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, message, null, null, errors);
};

export const unauthorized = (
  res: Response,
  message: string = RESPONSE_MESSAGES.UNAUTHORIZED
): Response => {
  return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, false, message);
};

export const forbidden = (
  res: Response,
  message: string = RESPONSE_MESSAGES.FORBIDDEN
): Response => {
  return sendResponse(res, HTTP_STATUS.FORBIDDEN, false, message);
};

export const notFound = (
  res: Response,
  message: string = RESPONSE_MESSAGES.NOT_FOUND
): Response => {
  return sendResponse(res, HTTP_STATUS.NOT_FOUND, false, message);
};

export const conflict = (res: Response, message: string = RESPONSE_MESSAGES.CONFLICT): Response => {
  return sendResponse(res, HTTP_STATUS.CONFLICT, false, message);
};

export const unprocessable = (res: Response, message: string, errors: unknown[] = []): Response => {
  return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, false, message, null, null, errors);
};

export const tooManyRequests = (
  res: Response,
  message: string = RESPONSE_MESSAGES.RATE_LIMIT_EXCEEDED
): Response => {
  return sendResponse(res, HTTP_STATUS.TOO_MANY_REQUESTS, false, message);
};

export const internalError = (
  res: Response,
  message: string = RESPONSE_MESSAGES.INTERNAL_ERROR,
  errors: unknown[] = []
): Response => {
  return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, message, null, null, errors);
};

export const serviceUnavailable = (
  res: Response,
  message: string = RESPONSE_MESSAGES.SERVICE_UNAVAILABLE
): Response => {
  return sendResponse(res, HTTP_STATUS.SERVICE_UNAVAILABLE, false, message);
};
