module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './ar360.db'
        },
        useNullAsDefault: true,
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    }
};