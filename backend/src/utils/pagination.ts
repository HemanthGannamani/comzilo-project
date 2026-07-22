import { PAGINATION } from '../shared/constants';

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPaginationOptions = (query: Record<string, any>): PaginationOptions => {
  const page = Math.max(1, parseInt(query.page || '', 10) || PAGINATION.DEFAULT_PAGE);
  const rawLimit = parseInt(query.limit || '', 10) || PAGINATION.DEFAULT_LIMIT;
  const limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, rawLimit));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

export const getPaginationMetadata = (
  page: number,
  limit: number,
  total: number
): PaginationMetadata => {
  const totalPages = Math.ceil(total / limit);
  return { page, limit, total, totalPages };
};
