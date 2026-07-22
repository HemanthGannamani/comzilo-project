/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from 'sequelize';

export interface FilterOptions {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const buildFilters = (
  query: Record<string, any>,
  searchColumns: string[] = []
): Record<string | symbol, any> => {
  const where: Record<string | symbol, any> = {};

  // Search filter
  if (query.search && searchColumns.length > 0) {
    const searchString = `%${query.search}%`;
    where[Op.or] = searchColumns.map((col) => ({
      [col]: {
        [Op.like]: searchString,
      },
    }));
  }

  // Status filter
  if (query.status) {
    where.status = query.status;
  }

  // Date range filter (created_at)
  if (query.startDate || query.endDate) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where.created_at = {} as Record<string, any>;
    if (query.startDate) {
      where.created_at[Op.gte] = new Date(query.startDate);
    }
    if (query.endDate) {
      where.created_at[Op.lte] = new Date(query.endDate);
    }
  }

  return where;
};
