import { sequelize } from '../../config/database';
import { logger } from '../../shared/logging/logger';

export const resetDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tables]: any = await sequelize.query('SHOW TABLES');
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0] as string;
      await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      logger.info(`Dropped table: ${tableName}`);
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    logger.info('Database reset completed successfully.');
  } catch (error) {
    logger.error('Error resetting database:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  resetDatabase().then(() => process.exit(0));
}
