const Record = require("../database/Record");

const getRecordForWorkout = (workoutId) => {
  try {
    const record = Record.getRecordForWorkout(workoutId);
    return record;
  } catch (error) {
    throw error;
  }
};

const getAllRecords = () => {
  try {
    const allRecords = Record.getAllRecords();
    return allRecords;
  } catch (error) {
    throw error;
  }
};

const getOneRecord = (recordId) => {
  try {
    const record = Record.getOneRecord(recordId);
    return record;
  } catch (error) {
    throw error;
  }
};

const createNewRecord = (newRecord) => {
  try {
    const createdRecord = Record.createNewRecord(newRecord);
    return createdRecord;
  } catch (error) {
    throw error;
  }
};

const updateOneRecord = (recordId, changes) => {
  try {
    const updatedRecord = Record.updateOneRecord(recordId, changes);
    return updatedRecord;
  } catch (error) {
    throw error;
  }
};

const deleteOneRecord = (recordId) => {
  try {
    Record.deleteOneRecord(recordId);
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