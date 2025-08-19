// In src/controllers/workoutController.js
const workoutService = require("../services/workoutService");

const getAllWorkouts = async (req, res) => {
  try {
    const allWorkouts = await workoutService.getAllWorkouts();
    res.send({ status: "OK", data: allWorkouts });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getOneWorkout = async (req, res) => {
  const { workoutId } = req.params;
  if (!workoutId) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':workoutId' can not be empty" },
      });
  }
  try {
    const workout = await workoutService.getOneWorkout(workoutId);
    if (!workout) {
      return res.status(404).send({
        status: "FAILED",
        data: { error: `Workout with ID ${workoutId} not found` },
      });
    }
    res.send({ status: "OK", data: workout });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const createNewWorkout = async (req, res) => {
  const { body } = req;
  if (!body.name || !body.exercises) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: {
          error:
            "One of the following keys is missing or is empty in request body: 'name', 'exercises'",
        },
      });
  }
  const newWorkout = {
    name: body.name,
    description: body.description || body.trainerTips,
    exercises: body.exercises,
    created_by: body.created_by,
    createdAt: new Date().toISOString(),
  };
  try {
    const createdWorkout = await workoutService.createNewWorkout(newWorkout);
    res.status(201).send({ status: "OK", data: createdWorkout });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const updateOneWorkout = async (req, res) => {
  const { workoutId } = req.params;
  const { body } = req;
  if (!workoutId) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':workoutId' can not be empty" },
      });
  }
  try {
    const updatedWorkout = await workoutService.updateOneWorkout(workoutId, body);
    if (!updatedWorkout) {
      return res.status(404).send({
        status: "FAILED",
        data: { error: `Workout with ID ${workoutId} not found` },
      });
    }
    res.send({ status: "OK", data: updatedWorkout });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const deleteOneWorkout = async (req, res) => {
  const { workoutId } = req.params;
  if (!workoutId) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':workoutId' can not be empty" },
      });
  }
  try {
    const deleted = await workoutService.deleteOneWorkout(workoutId);
    if (!deleted) {
      return res.status(404).send({
        status: "FAILED",
        data: { error: `Workout with ID ${workoutId} not found` },
      });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  getAllWorkouts,
  getOneWorkout,
  createNewWorkout,
  updateOneWorkout,
  deleteOneWorkout,
};

