const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);
const seedModule = require('../seeds/seed_data');

async function run() {
    try {
        console.log('Running seed_data.js...');
        await seedModule.seed(knex);
        console.log('Seed finished. Verifying users:');
        const users = await knex('users').select('id', 'name', 'email', 'role');
        console.log('Users:', users);
    } catch (err) {
        console.error('Seed error:', err.message || err);
    } finally {
        await knex.destroy();
    }
}

run();
