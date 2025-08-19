// Simple script to list users from the development SQLite DB using knex
const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);

async function main() {
    try {
        const users = await knex('users').select('id', 'name', 'email', 'role');
        console.log('DB users:', users);
    } catch (err) {
        console.error('Error querying DB:', err.message || err);
        process.exitCode = 1;
    } finally {
        await knex.destroy();
    }
}

main();
