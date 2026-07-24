/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDatabase, sequelize } from '../../config/database';
import migration from '../migrations/20260724000003-create-marketing-alias-tables';
import Sequelize from 'sequelize';

export const runMigrations = async () => {
  await connectDatabase();
  console.log('Running Marketing Tables Migration...');
  const queryInterface = sequelize.getQueryInterface();

  try {
    await migration.up(queryInterface, Sequelize as any);
    console.log('✅ Marketing Tables Migration executed successfully!');
  } catch (err: any) {
    console.log('Migration Note:', err?.message || err);
  }
};

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
