import { connectDatabase } from '../../config/database';
import { User, Customer, UserRole, UserProfile } from '../models';

export const purgeAccount = async () => {
  await connectDatabase();

  const email = 'hemanthgannamani@gmail.com';
  console.log(`Purging all records for: ${email}...`);

  const users = await User.findAll({ where: { email } });
  for (const u of users) {
    await UserRole.destroy({ where: { userId: u.id } });
    await UserProfile.destroy({ where: { userId: u.id } });
    await u.destroy({ force: true });
  }

  await Customer.destroy({ where: { email }, force: true });
  console.log(`✅ Permanently purged ${email} from MySQL database.`);
};

purgeAccount()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
