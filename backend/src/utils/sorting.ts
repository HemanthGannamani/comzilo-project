/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationError } from '../shared/errors/AppError';

export interface SortOrder {
  column: string;
  direction: 'ASC' | 'DESC';
}

export const getSortOrder = (
  query: Record<string, any>,
  allowedColumns: string[],
  defaultColumn = 'created_at',
  defaultDirection: 'ASC' | 'DESC' = 'DESC'
): SortOrder => {
  const column = query.sort || defaultColumn;
  let direction = String(query.direction || defaultDirection).toUpperCase();

  if (direction !== 'ASC' && direction !== 'DESC') {
    direction = defaultDirection;
  }

  if (!allowedColumns.includes(column)) {
    throw new ValidationError(`Sorting by column '${column}' is not allowed.`);
  }

  return {
    column,
    direction: direction as 'ASC' | 'DESC',
  };
};
