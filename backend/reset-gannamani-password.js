const bcrypt = require('bcrypt');
const { User } = require('./dist/database/models/user.js');

async function resetPassword() {
  const user = await User.findOne({ where: { email: 'gannamani@gmail.com' } });
  if (user) {
    const hash = await bcrypt.hash('Hemanth@123', 10);
    user.passwordHash = hash;
    await user.save();
    console.log('Password for gannamani@gmail.com updated to Hemanth@123');
  }
}

resetPassword();
