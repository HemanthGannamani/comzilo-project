import { connectDatabase, sequelize } from '../../config/database';

export const fixColumn = async () => {
  await connectDatabase();
  console.log('Altering product_images table url column to NULLABLE...');
  await sequelize.query(`ALTER TABLE product_images MODIFY COLUMN url VARCHAR(1024) NULL`);
  console.log('✅ Column url in product_images is now NULLABLE!');
};

fixColumn()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
