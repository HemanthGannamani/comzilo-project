import { connectDatabase } from '../../config/database';
import { Product, Media, ProductImage } from '../models';

export const testIncludeBoth = async () => {
  await connectDatabase();
  console.log('Testing Product.findAll with both Media and ProductImage includes...');

  try {
    const prods = await Product.findAll({
      limit: 5,
      include: [
        {
          model: Media,
          as: 'media',
        },
        {
          model: ProductImage,
          as: 'images',
        },
      ],
    });
    console.log(`✅ Success! Found ${prods.length} products.`);
  } catch (err: any) {
    console.error('❌ Query failed:', err.message);
  }
};

testIncludeBoth()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
