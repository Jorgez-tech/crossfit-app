// Script de verificación rápida con Knex
// Ejecuta: node verify_db.js

const knex = require('knex')({
    client: 'sqlite3',
    connection: { filename: './ar360.db' },
    useNullAsDefault: true
});

async function main() {
    const users = await knex('users').select('*');
    const wods = await knex('wods').select('*');
    const assignments = await knex('wod_assignments').select('*');
    const records = await knex('records').select('*');

    console.log('Usuarios:', users);
    console.log('WODs:', wods);
    console.log('Asignaciones:', assignments);
    console.log('Records:', records);

    await knex.destroy();
}

main();
