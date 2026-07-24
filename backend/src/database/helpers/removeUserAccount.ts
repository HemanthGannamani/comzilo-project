import { connectDatabase } from '../../config/database';
import { User, Customer, UserRole, UserProfile } from '../models';

export const removeUser = async () => {
  await connectDatabase();

  const email = 'pedapolukarthikroy7@gmail.com';
  console.log(`Removing pre-seeded test record for: ${email}...`);

  const user = await User.findOne({ where: { email } });
  if (user) {
    await UserRole.destroy({ where: { userId: user.id } });
    await UserProfile.destroy({ where: { userId: user.id } });
    await Customer.destroy({ where: { email }, force: true });
    await user.destroy({ force: true });
    console.log(`✅ Pre-seeded user record removed cleanly from MySQL database.`);
  } else {
    console.log(`No pre-seeded user found for ${email}.`);
  }
};

removeUser()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
