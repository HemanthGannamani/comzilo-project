const baileys = require('@innovatorssoft/baileys');
console.log('Baileys Keys:', Object.keys(baileys));
if (baileys.default) {
  console.log('Default Export Keys:', Object.keys(baileys.default));
}
process.exit(0);
