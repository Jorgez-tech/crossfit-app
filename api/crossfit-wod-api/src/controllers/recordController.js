// In src/controllers/recordController.js
const recordService = require("../services/recordService");

const getRecordForWorkout = async (req, res, next) => {
  try {
    const records = await recordService.getRecordForWorkout(req.params.workoutId);
    res.send({ status: "OK", data: records });
  } catch (error) {
    next(error);
  }
};

const getAllRecords = async (_req, res, next) => {
  try {
    const allRecords = await recordService.getAllRecords();
    res.send({ status: "OK", data: allRecords });
  } catch (error) {
    next(error);
  }
};

const getOneRecord = async (req, res, next) => {
  try {
    const record = await recordService.getOneRecord(req.params.recordId);
    res.send({ status: "OK", data: record });
  } catch (error) {
    next(error);
  }
};

const createNewRecord = async (req, res, next) => {
  try {
    const createdRecord = await recordService.createNewRecord(req.body);
    res.status(201).send({ status: "OK", data: createdRecord });
  } catch (error) {
    next(error);
  }
};

const updateOneRecord = async (req, res, next) => {
  try {
    const updatedRecord = await recordService.updateOneRecord(req.params.recordId, req.body);
    res.send({ status: "OK", data: updatedRecord });
  } catch (error) {
    next(error);
  }
};

const deleteOneRecord = async (req, res, next) => {
  try {
    await recordService.deleteOneRecord(req.params.recordId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecords,
  getOneRecord,
  createNewRecord,
  updateOneRecord,
  deleteOneRecord,
  getRecordForWorkout,
};
