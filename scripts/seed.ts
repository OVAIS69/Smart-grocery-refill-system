// This script can be used to seed a real database
// For the mock server, seed data is in mock-server/seed.js

import { seedData } from '../mock-server/seed.js';

console.log('Seed data structure:');
console.log(`Users: ${seedData.users.length}`);
console.log(`Products: ${seedData.products.length}`);
console.log(`Orders: ${seedData.orders.length}`);
console.log(`Notifications: ${seedData.notifications.length}`);

console.log('\nDemo Users:');
seedData.users.forEach((user) => {
  console.log(`  ${user.email} / password (${user.role})`);
});

console.log('\nProducts with low stock:');
seedData.products
  .filter((p) => p.stock <= p.threshold)
  .forEach((p) => {
    console.log(`  ${p.name}: ${p.stock} (threshold: ${p.threshold})`);
  });

export { seedData };

