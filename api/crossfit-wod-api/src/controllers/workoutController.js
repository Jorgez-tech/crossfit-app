// In src/controllers/workoutController.js
const workoutService = require("../services/workoutService");

const getAllWorkouts = async (_req, res, next) => {
  try {
    const allWorkouts = await workoutService.getAllWorkouts();
    res.send({ status: "OK", data: allWorkouts });
  } catch (error) {
    next(error);
  }
};

const getOneWorkout = async (req, res, next) => {
  try {
    const workout = await workoutService.getOneWorkout(req.params.workoutId);
    res.send({ status: "OK", data: workout });
  } catch (error) {
    next(error);
  }
};

const createNewWorkout = async (req, res, next) => {
  try {
    const createdWorkout = await workoutService.createNewWorkout({
      ...req.body,
      createdAt: new Date().toISOString()
    });
    res.status(201).send({ status: "OK", data: createdWorkout });
  } catch (error) {
    next(error);
  }
};

const updateOneWorkout = async (req, res, next) => {
  try {
    const updatedWorkout = await workoutService.updateOneWorkout(req.params.workoutId, req.body);
    res.send({ status: "OK", data: updatedWorkout });
  } catch (error) {
    next(error);
  }
};

const deleteOneWorkout = async (req, res, next) => {
  try {
    await workoutService.deleteOneWorkout(req.params.workoutId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWorkouts,
  getOneWorkout,
  createNewWorkout,
  updateOneWorkout,
  deleteOneWorkout,
};

