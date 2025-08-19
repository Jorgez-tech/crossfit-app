const Record = require("../database/Record");

const getRecordForWorkout = async (workoutId) => {
  try {
    return await Record.getRecordForWorkout(workoutId);
  } catch (error) {
    throw error;
  }
};

const getAllRecords = async () => {
  try {
    return await Record.getAllRecords();
  } catch (error) {
    throw error;
  }
};

const getOneRecord = async (recordId) => {
  try {
    return await Record.getOneRecord(recordId);
  } catch (error) {
    throw error;
  }
};

const createNewRecord = async (newRecord) => {
  try {
    return await Record.createNewRecord(newRecord);
  } catch (error) {
    throw error;
  }
};

const updateOneRecord = async (recordId, changes) => {
  try {
    return await Record.updateOneRecord(recordId, changes);
  } catch (error) {
    throw error;
  }
};

const deleteOneRecord = async (recordId) => {
  try {
    return await Record.deleteOneRecord(recordId);
  } catch (error) {
    throw error;
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