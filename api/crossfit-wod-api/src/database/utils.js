// Deprecated: this project now uses Knex and a real database.
// Keep a clear failure if any code path still imports this file.

module.exports = {
  saveToDatabase: () => {
    throw new Error('saveToDatabase is deprecated. Use Knex queries instead.');
  },
};