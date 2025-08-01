// In src/controllers/recordController.js
const DB = require("../database/db.json");
const recordService = require("../services/recordService");

const getRecordForWorkout = (req, res) => {
  const { workoutId } = req.params;
  if (!workoutId) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter 'workoutId' is required" },
    });
  }

  // Filtrar los records que correspondan al workoutId
  const records = DB.records.filter((record) => record.workout === workoutId);
  res.send({ status: "OK", data: records });
};

const getAllRecords = (req, res) => {
  try {
    const allRecords = recordService.getAllRecords();
    res.send({ status: "OK", data: allRecords });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getOneRecord = (req, res) => {
  const { recordId } = req.params;
  if (!recordId) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':recordId' can not be empty" },
      });
  }
  try {
    const record = recordService.getOneRecord(recordId);
    res.send({ status: "OK", data: record });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const createNewRecord = (req, res) => {
  const { body } = req;
  if (!body.workout || !body.record) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: {
          error:
            "One of the following keys is missing or is empty in request body: 'workout', 'record'",
        },
      });
  }
  const newRecord = {
    workout: body.workout,
    record: body.record,
  };
  try {
    const createdRecord = recordService.createNewRecord(newRecord);
    res.status(201).send({ status: "OK", data: createdRecord });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const updateOneRecord = (req, res) => {
  const { recordId } = req.params;
  const { body } = req;
  if (!recordId) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':recordId' can not be empty" },
      });
  }
  try {
    const updatedRecord = recordService.updateOneRecord(recordId, body);
    res.send({ status: "OK", data: updatedRecord });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const deleteOneRecord = (req, res) => {
  const { recordId } = req.params;
  if (!recordId) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':recordId' can not be empty" },
      });
  }
  try {
    recordService.deleteOneRecord(recordId);
    res.status(204).send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  getAllRecords,
  getOneRecord,
  createNewRecord,
  updateOneRecord,
  deleteOneRecord,
  getRecordForWorkout, // ya implementado
};
