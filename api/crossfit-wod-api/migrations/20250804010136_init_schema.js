/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').notNullable().unique();
            table.string('password_hash').notNullable();
            table.enu('role', ['entrenador', 'atleta']).notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('wods', function (table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.text('description');
            table.text('exercises'); // Puede ser JSON o texto largo
            table.integer('created_by').unsigned().references('id').inTable('users');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('wod_assignments', function (table) {
            table.increments('id').primary();
            table.integer('wod_id').unsigned().references('id').inTable('wods');
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.timestamp('assigned_date').defaultTo(knex.fn.now());
            table.string('status').defaultTo('pendiente');
        })
        .createTable('records', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.integer('wod_id').unsigned().references('id').inTable('wods');
            table.string('result').notNullable();
            table.text('notes');
            table.timestamp('date').defaultTo(knex.fn.now());
        })
        .then(function () {
            return Promise.all([
                knex.schema.raw('CREATE INDEX idx_records_user ON records(user_id)'),
                knex.schema.raw('CREATE INDEX idx_records_wod ON records(wod_id)')
            ]);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('records')
        .dropTableIfExists('wod_assignments')
        .dropTableIfExists('wods')
        .dropTableIfExists('users');
};