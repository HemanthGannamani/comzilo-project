import { checkDatabaseConnection } from '../../config/database';

export const getDatabaseHealthStatus = async (): Promise<'UP' | 'DOWN'> => {
  const isHealthy = await checkDatabaseConnection();
  return isHealthy ? 'UP' : 'DOWN';
};
