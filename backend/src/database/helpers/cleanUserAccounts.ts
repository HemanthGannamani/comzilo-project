import { connectDatabase } from '../../config/database';
import { User, Customer, UserRole, UserProfile } from '../models';

export const cleanUserAccounts = async () => {
  await connectDatabase();

  const emailsToClean = ['hemanthgannamani@gmail.com', 'pedapolukarthikroy7@gmail.com'];

  for (const email of emailsToClean) {
    console.log(`Cleaning existing records for: ${email}...`);
    const users = await User.findAll({ where: { email } });
    for (const user of users) {
      await UserRole.destroy({ where: { userId: user.id } });
      await UserProfile.destroy({ where: { userId: user.id } });
      await user.destroy({ force: true });
    }
    await Customer.destroy({ where: { email }, force: true });
    console.log(`✅ Cleaned records for ${email}`);
  }
};

cleanUserAccounts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
