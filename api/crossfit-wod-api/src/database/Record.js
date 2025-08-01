const DB = require("./db.json");
const { saveToDatabase } = require("./utils");

const getRecordForWorkout = (workoutId) => {
  try {
    const record = DB.records.filter((record) => record.workout === workoutId);
    if (!record) {
      throw {
        status: 400,
        message: `Can't find workout with the id '${workoutId}'`,
      };
    }
    return record;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const getAllRecords = () => {
  try {
    return DB.records;
  } catch (error) {
    throw { status: 500, message: error };
  }
};

const getOneRecord = (recordId) => {
  try {
    const record = DB.records.find((record) => record.id === recordId);
    if (!record) {
      throw {
        status: 400,
        message: `Can't find record with the id '${recordId}'`,
      };
    }
    return record;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const createNewRecord = (newRecord) => {
  try {
    DB.records.push(newRecord);
    saveToDatabase(DB);
    return newRecord;
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

const updateOneRecord = (recordId, changes) => {
  try {
    const indexForUpdate = DB.records.findIndex(
      (record) => record.id === recordId
    );
    if (indexForUpdate === -1) {
      throw {
        status: 400,
        message: `Can't find record with the id '${recordId}'`,
      };
    }
    const updatedRecord = {
      ...DB.records[indexForUpdate],
      ...changes,
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    DB.records[indexForUpdate] = updatedRecord;
    saveToDatabase(DB);
    return updatedRecord;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const deleteOneRecord = (recordId) => {
  try {
    const indexForDeletion = DB.records.findIndex(
      (record) => record.id === recordId
    );
    if (indexForDeletion === -1) {
      throw {
        status: 400,
        message: `Can't find record with the id '${recordId}'`,
      };
    }
    DB.records.splice(indexForDeletion, 1);
    saveToDatabase(DB);
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