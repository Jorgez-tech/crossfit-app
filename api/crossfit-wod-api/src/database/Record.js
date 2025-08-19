const knex = require('./knex');

const getRecordForWorkout = async (workoutId) => {
  try {
    const records = await knex('records').where({ wod_id: workoutId }).select('*');
    return records;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const getAllRecords = async () => {
  try {
    return await knex('records').select('*');
  } catch (error) {
    throw { status: 500, message: error };
  }
};

const getOneRecord = async (recordId) => {
  try {
    const record = await knex('records').where({ id: recordId }).first();
    if (!record) {
      throw { status: 400, message: `Can't find record with the id '${recordId}'` };
    }
    return record;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const createNewRecord = async (newRecord) => {
  try {
    const [id] = await knex('records').insert({
      user_id: newRecord.user_id,
      wod_id: newRecord.wod_id,
      result: newRecord.result,
      notes: newRecord.notes,
      date: newRecord.date || knex.fn.now(),
    });
    return await knex('records').where({ id }).first();
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

const updateOneRecord = async (recordId, changes) => {
  try {
    const updated = await knex('records').where({ id: recordId }).update(changes);
    if (!updated) {
      throw { status: 400, message: `Can't find record with the id '${recordId}'` };
    }
    return await knex('records').where({ id: recordId }).first();
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const deleteOneRecord = async (recordId) => {
  try {
    const deleted = await knex('records').where({ id: recordId }).del();
    if (!deleted) {
      throw { status: 400, message: `Can't find record with the id '${recordId}'` };
    }
    return true;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

module.exports = {
  getRecordForWorkout,
  getAllRecords,
  getOneRecord,
  createNewRecord,
  updateOneRecord,
  deleteOneRecord,
};