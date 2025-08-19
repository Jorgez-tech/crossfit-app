// In src/controllers/recordController.js
const recordService = require("../services/recordService");

const getRecordForWorkout = async (req, res) => {
  const { workoutId } = req.params;
  if (!workoutId) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter 'workoutId' is required" },
    });
  }

  try {
    const records = await recordService.getRecordForWorkout(workoutId);
    res.send({ status: "OK", data: records });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getAllRecords = async (req, res) => {
  try {
    const allRecords = await recordService.getAllRecords();
    res.send({ status: "OK", data: allRecords });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getOneRecord = async (req, res) => {
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
    const record = await recordService.getOneRecord(recordId);
    res.send({ status: "OK", data: record });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const createNewRecord = async (req, res) => {
  const { body } = req;
  if (!body.user_id || !body.wod_id || !body.result) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: {
          error:
            "One of the following keys is missing or is empty in request body: 'user_id', 'wod_id', 'result'",
        },
      });
  }
  const newRecord = {
    user_id: body.user_id,
    wod_id: body.wod_id,
    result: body.result,
    notes: body.notes,
    date: body.date,
  };
  try {
    const createdRecord = await recordService.createNewRecord(newRecord);
    res.status(201).send({ status: "OK", data: createdRecord });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const updateOneRecord = async (req, res) => {
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
    const updatedRecord = await recordService.updateOneRecord(recordId, body);
    res.send({ status: "OK", data: updatedRecord });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const deleteOneRecord = async (req, res) => {
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
    await recordService.deleteOneRecord(recordId);
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
