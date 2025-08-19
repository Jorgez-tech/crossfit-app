// In src/database/Workout.js
const knex = require('./knex');

const getAllWorkouts = async () => {
  try {
    return await knex('wods').select('*');
  } catch (error) {
    throw { status: 500, message: error };
  }
};

const getOneWorkout = async (workoutId) => {
  try {
    const workout = await knex('wods').where({ id: workoutId }).first();
    if (!workout) {
      throw { status: 400, message: `Can't find workout with the id '${workoutId}'` };
    }
    return workout;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const createNewWorkout = async (newWorkout) => {
  try {
    // map expected fields to DB columns
    const payload = {
      name: newWorkout.name,
      description: newWorkout.description || newWorkout.trainerTips || null,
      exercises: typeof newWorkout.exercises === 'string' ? newWorkout.exercises : JSON.stringify(newWorkout.exercises || ''),
      created_by: newWorkout.created_by || null,
      created_at: newWorkout.createdAt || knex.fn.now(),
    };
    const [id] = await knex('wods').insert(payload);
    return await knex('wods').where({ id }).first();
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const updateOneWorkout = async (workoutId, changes) => {
  try {
    // prepare update payload only with allowed columns
    const payload = {};
    if (changes.name) payload.name = changes.name;
    if (changes.description) payload.description = changes.description;
    if (changes.trainerTips) payload.description = changes.trainerTips;
    if (changes.exercises) payload.exercises = typeof changes.exercises === 'string' ? changes.exercises : JSON.stringify(changes.exercises);

    const updated = await knex('wods').where({ id: workoutId }).update(payload);
    if (!updated) {
      throw { status: 400, message: `Can't find workout with the id '${workoutId}'` };
    }
    return await knex('wods').where({ id: workoutId }).first();
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const deleteOneWorkout = async (workoutId) => {
  try {
    const deleted = await knex('wods').where({ id: workoutId }).del();
    if (!deleted) {
      throw { status: 400, message: `Can't find workout with the id '${workoutId}'` };
    }
    return true;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

module.exports = {
  getAllWorkouts,
  createNewWorkout,
  getOneWorkout,
  updateOneWorkout,
  deleteOneWorkout,
};
