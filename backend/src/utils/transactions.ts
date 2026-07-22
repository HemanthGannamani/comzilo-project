import { Transaction } from 'sequelize';
import { sequelize } from '../config/database';

export const withTransaction = async <T>(
  callback: (transaction: Transaction) => Promise<T>,
  existingTransaction?: Transaction
): Promise<T> => {
  if (existingTransaction) {
    return callback(existingTransaction);
  }

  return sequelize.transaction(callback);
};
export default withTransaction;
